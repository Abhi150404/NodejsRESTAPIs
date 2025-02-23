const express = require('express')
const db = require('./conn')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const multer = require('multer')

const app = express();
app.use(cors());
app.use('/images', express.static('uploads')); // images= Access Key

app.use(bodyParser.urlencoded({extended: true})); // for posting data
app.use(bodyParser.json()); //converting objects into string

//file upload function
const upload_file = multer({
    storage:multer.diskStorage({
        destination: function(req,file,cb){
            cb(null,'uploads');
        },
        filename:function(req,file,cb){
            let fileName = 'FILE' + Number(new Date())+ path.extname(file.originalname);
            cb(null,fileName)
        },
    }),
}).single('uploaded_file');


//Retreving/Display Data || CRUD
app.get('/get_data',function(req,res){
    db.query('select * from user_info',function(error,results,fields){
        if(error) throw error;
        res.end(JSON.stringify(results));
        
    });

});
//Saving Data ||CRUD
app.post("/save_data",upload_file,function(req,res){
    let dt = req.body;
    let user_name =dt.user_name;
    let mob = dt.mob;
    let dob = dt.dob;
    let userid=get_user_id();
    let pwd = genPassword();

    let file_name = req.file.filename;
    let cmd= `INSERT INTO user_info VALUES('${userid}','${user_name}','${mob}','${dob}','${file_name}','${pwd}')`;
    db.query(cmd,function(error,results,fields){
        if(error) throw error;
        res.end('Data Save');
    });
});
//delete data || CRUD

app.post('/delete_data',function(req,res){
    let dt = req.body;
    let user_id=dt.UserID; //token -object
    let cmd = `DELETE FROM user_info WHERE userid='${user_id}'`;
    db.query(cmd,function(error,results,fields){
        if(error) throw error;
        res.end('Data Deleted');
    });
});

//Update data|| CRUD

app.post("/update_data",function(req,res){
    let dt = req.body;
    let userid = dt.user_id
    let uname =dt.user_name;
    let mob = dt.mob;
    let dob = dt.dob;
    let cmd =`UPDATE user_info SET user_name='${uname}',mob='${mob}',dob=${dob} where userid='${userid}'`
    db.query(cmd,function(error,results,fields){
        if(error) throw error;
        res.end('Data Updated');
    });


});


function get_user_id(){
    let timestamp = Number(new Date());
    return 'STU'+timestamp
}
function genPassword(){
    let lower = 'abcdefghijklmnopqrstuvwxyz';
    let uppar= 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let number ='1234567890';
    let all = lower+uppar+number;
    let pass =all
    .split('')
    .sort(function(){
      return 0.5 - Math.random();
    })
    .join('');
    return pass.substring(0,8);
}

app.listen(2024);
console.log('http://localhost:2024/');