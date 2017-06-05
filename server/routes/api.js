// Express server
const express = require('express');
const router = express.Router();

// MongoDB
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
var db;
// Connection URL 
var url = 'mongodb://localhost:27017/notes';

// Initialize MongoDB database connection once
MongoClient.connect(url, function(err, database) {
    if (err) return console.error(err);

    db = database;

    console.log("Connected correctly to server");

    // The Mongo driver recommends starting the server here because most apps *should* fail to start if they have no DB.
});

// Get API status
router.get('/', (req, res) => {
    console.log('API is live!');
    res.send(JSON.stringify({ status: 'live' }));
});

// Get all notes
router.get('/notes', (req, res) => {

    db.collection("notes").find({}, { sort: { '_id': -1 } }).toArray(function(err, docs) {
        if (err)
            return res.status(500).send(error);
        // assert.equal(err, null);
        console.log("Found " + docs.length + " records.");
        res.status(200).json(docs);
    });
});

// Add a new note
router.get('/addNote/:noteIn', (req, res) => {
    var noteIn = req.params.noteIn;

    insertNote(db, noteIn, function() {
        console.log('Insert note complete.');
        res.send(JSON.stringify({ response: 'inserted' }));
    });
});

// Edit a note (Update)
router.get('/editNote/:noteId/:noteBody', (req, res) => {
    var noteId = req.params.noteId;
    var noteBody = req.params.noteBody;

    editNote(db, noteId, noteBody, function() {
        console.log('Edit note complete.');
        res.send(JSON.stringify({ response: 'edited' }));
    });
});

// Delete a note
router.get('/deleteNote/:noteId', (req, res) => {
    var noteId = req.params.noteId;

    deleteNote(db, noteId, function() {
        console.log('Delete note complete.');
        res.send(JSON.stringify({ response: 'deleted' }));
    });
});

/**
 * Edits a note in the DB.
 * @param {*} db connection
 * @param {*} noteId unique id
 * @param {*} noteBody updated body
 * @param {*} callback 
 */
var editNote = function(db, noteId, noteBody, callback) {
    var collection = db.collection('notes');
    var ObjectId = mongodb.ObjectId;
    // Edit note
    collection.updateOne({ _id: ObjectId(noteId) }, { $set: { body: noteBody } }, function(err, result) {
        assert.equal(err, null);
        callback(result);
    });
}

/**
 * Delete a note from the DB.
 * @param {*} db connection
 * @param {*} noteId unique id
 * @param {*} callback 
 */
var deleteNote = function(db, noteId, callback) {
    var collection = db.collection('notes');
    var ObjectId = mongodb.ObjectId;
    // Delete note 
    collection.remove({ _id: ObjectId(noteId) }, function(err, result) {
        assert.equal(err, null);
        callback(result);
    });
}

/**
 * Inserts a new note to the DB.
 * @param {*} db connection
 * @param {*} note new note/body
 * @param {*} callback 
 */
var insertNote = function(db, note, callback) {
    var collection = db.collection('notes');
    // Insert a note 
    collection.insertMany([
        { body: note }
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        assert.equal(1, result.ops.length);
        console.log("Inserted note into the database.");
        callback(result);
    });
}

module.exports = router;