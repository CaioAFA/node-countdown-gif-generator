// server
const express = require('express');
const app = express();
const fs = require('fs');
var multiparty = require('connect-multiparty');

const tmpDir = __dirname + '/tmp/';
const publicDir = __dirname + '/public/';

// canvas generator
const CountdownGenerator = require('./countdown-generator');

app.use(express.static(publicDir));
app.use(express.static(tmpDir));
app.use(multiparty());

// Root - Generator
app.get('/', function (req, res) {
    console.log('asdasd')
    res.sendFile(publicDir + 'link-generator.html');
});

// Generate and download the gif
app.get('/generate', function (req, res) {
    try {
        let {
            time,
            width,
            height,
            color,
            bg,
            name,
            frames,
            fontSize,
            fontFamily
        } = req.query;

        if (!time) {
            throw Error('Time parameter is required.');
        }

        CountdownGenerator.init(time, width, height, color, bg, name, frames, fontSize, fontFamily, () => {
            let filePath = tmpDir + name + '.gif';
            res.set('Cache-Control', 'no-store')
            res.download(filePath);
        });
    } catch (error) {

    }
});

// serve the gif to a browser
app.get('/serve', function (req, res) {
    try {
        let {
            time,
            width,
            height,
            color,
            bg,
            name,
            frames,
            fontSize,
            fontFamily
        } = req.query;

        if (!time) {
            throw Error('Time parameter is required.');
        }

        CountdownGenerator.init(time, width, height, color, bg, name, frames, fontSize, fontFamily, () => {
            let filePath = tmpDir + name + '.gif';
            res.set('Cache-Control', 'no-store')
            res.sendFile(filePath);
        });
    } catch (error) {

    }
});

app.get('/fonts', function (req, res) {
    const fontsFolder = './fonts/';

    fs.readdir(fontsFolder, (err, files) => {
        files = files.map(f => f.replace('.ttf', ''))
        res.json(files)
    });
})

app.post('/fonts', function (req, res) {
    const newFont = req.files['new-font']
    if(!newFont){
        res.status(500)
        res.send('Error on font submit')
        return
    }

    const tmpPath = newFont['path']
    const fileName = newFont['name']
    fs.copyFileSync(tmpPath, __dirname + '/fonts/' + fileName)

    res.end()
})

app.delete('/fonts/:font', function(req, res){
    const fontToDelete = req.params.font

    if(fontToDelete == 'Arial'){
        res.status(500)
        return res.send('Você não pode deletar a fonte padrão')
    }

    fs.unlinkSync(__dirname + `/fonts/${fontToDelete}.ttf`)
    res.end(fontToDelete)
})

app.listen(process.env.PORT || 3001, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

module.exports = app;
