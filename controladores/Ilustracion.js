const { uploadImage, deleteImage } = require('../middleware/cloudinary');
const { response } = require('express');
const { Ilustracion, Guardados } = require('../modelos/Ilustracion');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');


// Función de validación para verificar si se proporciona una imagen
const validarImagen = (value, { req }) => {
    if (!req.files || !req.files.imagen) {
        throw new Error('La imagen no puede estar vacía');
    }
    return true;
};

//Añadir una ilustracion
const subirIlustracion = async (req, res = response) => {
    //Extraemos los datos de la ilustracion del cuerpo de la petición
    const { nombre } = req.body

    try {
        // Verificar si ya existe una ilustración con el mismo nombre
        let ilustracion = await Ilustracion.findOne({ nombre });

        // Si la ilustración ya existe, generar un nuevo nombre único
        while (ilustracion) {
            nombre = uuidv4(); // Generar un nuevo UUID como nombre único
            ilustracion = await Ilustracion.findOne({ nombre });
        }

        // Agregar el nuevo nombre único al cuerpo de la solicitud
        req.body.nombre = nombre;

        //Si la ilustracion no existe, creamos un nuevo objeto Ilustracion con los datos recibidos en el cuerpo de la petición
        ilustracion = new Ilustracion(req.body);

        let result = "";
        // Verifica si se ha enviado una imagen en la solicitud
        if (req.files?.imagen) {
            //Subir imagen
            result = await uploadImage(req.files.imagen.tempFilePath);

            await fs.unlink(req.files.imagen.tempFilePath);
        }

        //Añado el secure_url de la imagen al campo imagen de la base de datos
        ilustracion.imagen.public_id = result.public_id;
        ilustracion.imagen.secure_url = result.secure_url;

        //Guardamos el ilustracion en la base de datos utilizando el método save() de Mongoose
        await ilustracion.save();

        //Devolvemos una respuesta con los datos del ilustracion recién subida
        return res.json({
            ok: true,
            mensaje: "subir",
            nombre: ilustracion.nombre,
            descripcion: ilustracion.descripcion,
            imagen: {
                public_id: result.public_id,
                secure_url: result.secure_url
            },
            usuario: ilustracion.usuario
        })
    } catch (error) {
        //Si se produce un error durante la subida de el ilustracion, lo capturamos y devolvemos una respuesta de error
        return res.status(500).json({
            ok: false,
            mensaje: 'error en el servidor'
        })
    }

}

//Buscar ilustracion buscador por nombre
const buscarIlustracion = async (req, res = response) => {
    // Obtenemos el nombre del ilustracion a buscar a partir del cuerpo de la solicitud
    const { nombre } = req.body;

    try {
        // Buscamos todos los ilustraciones en la base de datos que tengan un nombre que coincida parcialmente con el nombre especificado
        const ilustraciones = await Ilustracion.find({ nombre: { $regex: nombre, $options: 'i' } });

        // Si no se encuentra ningún ilustracion con el nombre especificado, devolvemos una respuesta de error
        if (ilustraciones.length === 0) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se encontraron ilustraciones con ese nombre en la BD'
            });
        }

        // Si se encuentran ilustraciones con el nombre especificado, devolvemos una respuesta con los ilustraciones encontrados
        const resultados = ilustraciones.map((ilustracion) => ({
            nombre: ilustracion.nombre,
            descripcion: ilustracion.descripcion,
            imagen: ilustracion.imagen,
            usuario: ilustracion.usuario,
            id: ilustracion.id
        }));

        return res.json(resultados);
    } catch (error) {
        // Si se produce un error durante la búsqueda, devolvemos una respuesta de error
        return res.status(500).json({
            ok: false,
            mensaje: 'Error en el servidor'
        });
    }
};


//Listar todos las ilustraciones
const listarIlustraciones = async (req, res = response) => {
    try {
        //Realizamos la búsqueda de todos los ilustraciones en la base de datos utilizando el método find() de Mongoose
        const ilustraciones = await Ilustracion.find();

        //Si la búsqueda se realiza correctamente, devolvemos una respuesta con un objeto JSON que contiene el arreglo de ilustraciones
        return res.json({
            ok: true,
            mensaje: "listado de ilustraciones:",
            ilustraciones
        });
    } catch (error) {
        //Si se produce un error durante la búsqueda, lo capturamos y devolvemos una respuesta de error
        console.error(error);
        return res.status(500).json({
            ok: false,
            mensaje: "error en el servidor"
        });
    }
}

//Actualizar una ilustracion
const actualizarIlustracion = async (req, res = response) => {
    //Obtenemos el nombre del ilustracion a actualizar desde los parámetros de la solicitud
    const { nombre } = req.params;
    //Obtenemos la nueva información de la ilustracion desde el cuerpo de la solicitud
    const { descripcion } = req.body;

    try {
        //Utilizamos el método updateOne() de Mongoose para actualizar el ilustracion en la base de datos
        const result = await Ilustracion.updateOne(
            //Especificamos el criterio de búsqueda
            { nombre: nombre },
            //Especificamos los campos que queremos actualizar utilizando el operador $set de MongoDB
            { $set: { descripcion } }
        );

        //Si el número de documentos modificados es 0, significa que la película no existe en la base de datos
        if (result.modifiedCount === 0) {
            return res.status(404).json({ mensaje: 'registro no encontrado' });
        }

        //Si la actualización se realizó correctamente, devolvemos una respuesta exitosa
        return res.json({ mensaje: 'registro actualizado' });
    } catch (error) {
        //Si se produce un error durante la actualización, lo capturamos y devolvemos una respuesta de error
        console.error(error);
        return res.status(500).json({ mensaje: 'error en el servidor' });
    }
}

//Eliminar una ilustracion
const eliminarIlustracion = async (req, res) => {
    //Obtenemos el nombre del ilustracion a eliminar de los parámetros de la solicitud
    const { nombre } = req.params;

    try {
        //Busco la ilustración por nombre
        const ilustracion = await Ilustracion.findOne({ nombre });

        //Utilizamos el método deleteOne() de Mongoose para eliminar el ilustracion con el título especificado
        const result = await Ilustracion.deleteOne({ nombre: nombre });

        //Si el resultado indica que no se eliminó ningún registro, devolvemos un error 404
        if (result.deletedCount === 0) {
            return res.status(404).json({ mensaje: 'registro no encontrado' });
        }

        //Eliminar imagen de cloudinary
        await deleteImage(ilustracion.imagen.public_id);

        //Si se eliminó el registro correctamente, devolvemos un mensaje de éxito
        return res.json({ mensaje: 'registro eliminado' });
    } catch (error) {
        //Si se produce un error durante la eliminación, lo capturamos y devolvemos una respuesta de error
        console.error(error);
        return res.status(500).json({ mensaje: 'error en el servidor' });
    }
}

//Dar me gusta
const agregarMeGustaIlustracion = async (req, res) => {
    const { nombre } = req.params;

    try {
        const ilustracion = await Ilustracion.findOne({ nombre });
        if (!ilustracion) return res.status(404).json({ mensaje: 'ilustración no encontrada' });

        // Verificar si el usuario ya ha dado me gusta
        const user = req.body.usuario;
        if (!ilustracion.likes.includes(user)) {
            ilustracion.likes.push(user);
            await ilustracion.save();
            return res.status(200).json({ mensaje: 'me gusta añadido' });
        }

        return res.status(400).json({ mensaje: 'ya has dado me gusta a esta ilustración' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al dar me gusta' });
    }
}

//Quitar me gusta
const deleteMeGustaIlustracion = async (req, res) => {
    const { nombre } = req.params;

    try {
        const ilustracion = await Ilustracion.findOne({ nombre });
        if (!ilustracion) return res.status(404).json({ mensaje: 'ilustración no encontrada' });

        // Verificar si el usuario ha dado me gusta
        const user = req.body.usuario;
        if (ilustracion.likes.includes(user)) {
            ilustracion.likes = ilustracion.likes.filter(likeUser => likeUser !== user);
            await ilustracion.save();
            return res.status(200).json({ mensaje: 'me gusta eliminado' });
        }

        return res.status(400).json({ mensaje: 'no has dado me gusta a esta ilustración' });
    } catch (error) {
        res.status(500).json({ mensaje: 'error al quitar me gusta' });
    }
}

//Listar me gusta de un usuario
const listarMeGustaIlustracion = async (req, res) => {
    try {
        const usuario = req.params.usuario;
        const ilustraciones = await Ilustracion.find({ likes: usuario });

        if (!ilustraciones) return res.status(404).json({ mensaje: 'no se encontraron ilustraciones' });

        return res.status(200).json(ilustraciones);
    } catch (error) {
        res.status(500).json({ mensaje: 'error al obtener las ilustraciones' });
    }
}

//Añadir a guardados
const agregarGuardados = async (req, res) => {
    const { nombre } = req.body;
    const { propietario } = req.body;

    try {

        let ilustracionExistente = await Guardados.findOne({ nombre, propietario });

        if (ilustracionExistente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La ilustración ya está guardada',
            });
        }

        let ilustracion = await Ilustracion.findOne({ nombre })

        if (!ilustracion) {
            return res.status(400).json({
                ok: false,
                mensaje: 'la ilustración no existe en la BD'
            })
        }

        const entradaGuardados = new Guardados({
            nombre: ilustracion.nombre,
            descripcion: ilustracion.descripcion,
            imagen: ilustracion.imagen,
            usuario: ilustracion.usuario,
            propietario: propietario,
        });

        await entradaGuardados.save();

        return res.json({
            ok: true,
            mensaje: "agregar",
            nombre: ilustracion.nombre,
            descripcion: ilustracion.descripcion,
            imagen: ilustracion.imagen,
            usuario: ilustracion.usuario
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            mensaje: 'error en el servidor',
            error: error.message
        })
    }
}

//Listar guardados
const listarGuardados = async (req, res = response) => {
    try {
        //Realizamos la búsqueda de todos los videojuegos en la base de datos utilizando el método find() de Mongoose
        const guardados = await Guardados.find();

        //Si la búsqueda se realiza correctamente, devolvemos una respuesta con un objeto JSON que contiene el arreglo de ilustraciones
        return res.json({
            ok: true,
            mensaje: "listado de ilustraciones guardadas:",
            guardados
        });
    } catch (error) {
        //Si se produce un error durante la búsqueda, lo capturamos y devolvemos una respuesta de error
        console.error(error);
        return res.status(500).json({
            ok: false,
            mensaje: "error en el servidor"
        });
    }
}

//Eliminar guardados
const eliminarGuardados = async (req, res) => {
    //Obtenemos el nombre del videojuego a eliminar de los parámetros de la solicitud
    const { nombre } = req.params;
    const { propietario } = req.params;

    try {
        //Utilizamos el método deleteOne() de Mongoose para eliminar la ilustración con el nombre especificado
        const result = await Guardados.deleteOne({ nombre: nombre, propietario: propietario });

        //Si el resultado indica que no se eliminó ningún registro, devolvemos un error 404
        if (result.deletedCount === 0) {
            return res.status(404).json({ mensaje: 'registro no encontrado' });
        }

        //Si se eliminó el registro correctamente, devolvemos un mensaje de éxito
        return res.json({ mensaje: 'registro eliminado' });
    } catch (error) {
        //Si se produce un error durante la eliminación, lo capturamos y devolvemos una respuesta de error
        console.error(error);
        return res.status(500).json({ mensaje: 'error en el servidor' });
    }
}

//Exportamos las funciones para que puedan ser utilizadas desde otros módulos
module.exports = {
    validarImagen, subirIlustracion, buscarIlustracion, listarIlustraciones, actualizarIlustracion, eliminarIlustracion, agregarMeGustaIlustracion, deleteMeGustaIlustracion, listarMeGustaIlustracion, agregarGuardados, listarGuardados, eliminarGuardados
}