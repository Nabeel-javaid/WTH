const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    salary: { type: String, required: true },
    skills: { type: String, required: true },
    employer: { type: String, required: true},
    students: [{ type: [String], required: false }]
    }, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);