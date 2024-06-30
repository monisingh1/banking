const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const multipleDocumentSchema = mongoose.Schema({
    doc_name: {
        type: String,
        required: [true, "Document Name is required"],
        trim: true
    },
    upload_doc: {
        type: Array,
        default:
        [
            {
                
                name: {
                    type: String,
                    required: [true, "originalname is required"],
                    trim: true,
                },
                mimetype: {
                    type: String,
                    required: [true, "mimetype is required"],
                    trim: true,
                },
                path: {
                    type: String,
                    required: [true, "path is required"],
                    trim: true,
                },
                size: {
                    type: Number,
                    required: [true, "size is required"],
                }
            }
        ]
    },
    customer_id: {
        type: Schema.Types.ObjectId,
        ref: "Customer"
    },
})
const multipledocumentmodal = mongoose.model("multipledocument", multipleDocumentSchema)
module.exports = multipledocumentmodal