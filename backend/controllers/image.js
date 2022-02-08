function upload (req, res) {
    if(req.file.filename) {
        res.status(201).json({
            message: 'Image enregistré avec succès',
            url: req.file.filename
        });
    }else{
        res.status(500).json({
            message: 'Un problème est survenue'
        });
    }
}

module.exports = {
    upload: upload
}