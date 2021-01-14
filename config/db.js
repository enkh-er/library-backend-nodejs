const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI,{
      useNewUrlParser:true,  // shine oorchilson uri parse hiij ashiglah
      useCreateIndex:true,  //huuchirsan deprecated hiisen zuiliig ashiglahgvi shine huwilbariig ashiglana
      useFindAndModify:false, //deprecated boltson zuiliih ashiglahgvi
      useUnifiedTopology:true, // servervvdtei haritsah shine huwilbaruudiig hereglene
  });
  console.log(`success connect MongoDB: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports=connectDB;
