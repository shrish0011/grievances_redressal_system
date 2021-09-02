const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

var grievanceSchema = new mongoose.Schema({

     fullName: {
         type : String
     },
     email: {
         type: String
     },
     phone: {
         type: String
     },
     description:{
         type: String
     },
     location:{
         type: String
     },
     status: {
        type: String
    },
     image: {
        data: Buffer,
        name: String
     },
     comments: {
         type: String
     }
     
    
});
autoIncrement.initialize(mongoose.connection);
grievanceSchema.plugin(autoIncrement.plugin,{
    model: "grievance",
    field: "_id",
    startAt: 1,
    incrementBy: 1
});
mongoose.model('grievanceModel',grievanceSchema);