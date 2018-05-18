var connection = require('../../config/db');
 
function Todo() {
 
  this.get = function(req,res,next) {
     db.acquire(function(err,con){
        if (err) throw err;
          con.query('SELECT * FROM tamu', function(err,data){
            con.release();
            if(err)
               return res.json({status:'400',message: 'Failed',result:[]});
               
            return res.json({status:'200',message:'success',result:data});
        });
     });
  };

  this.create = function(req, res) {
    db.acquire(function(err, con) {
      con.query('insert into tamu set ?', req.body, function(err, result) {
        con.release();
        if (err) {
          res.send({status: 400, message: 'User creation failed'});
        } else {
          res.send({status: 200, message: 'User created successfully'});
        }
      });
    });
};

this.update = function(req, res) {
    db.acquire(function(err, con) {
      con.query('update tamu set ? where id = ?', [req.body, req.body.id], function(err, result) {
        con.release();
        if (err) {
          res.send({status: 400, message: 'User update failed'});
        } else {
          res.send({status: 200, message: 'User updated successfully'});
        }
      });
    });
  };

  this.delete = function(id, res) {
    db.acquire(function(err, con) {
      con.query('delete from tamu where id = ?', [id], function(err, result) {
        con.release();
        if (err) {
          res.send({status: 400, message: 'Failed to delete'});
        } else {
          res.send({status: 200, message: 'Deleted successfully'});
        }
      });
    });
  };
}
module.exports = new Todo();
