'use strict';
var dbm;
var type;
var seed;


/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

var collectionNames  =  [
    'codes' ,
    'company',
    'orgchart',
    'person',
    'projectmembers',
    'projectsmart-contracts',
    'projectsubmission',
    'projects',
    'supportingdocs',
    'uploadmodels',
    'upload_models_guids',
    'upload_models_project',
    'upload_models_props',
    'usergroup',
    'userpermission',
    'webform',
    'webformdep',
    'webformfields',
    'webformfieldsmetadata',
    'webformvalidation',
    'workflow'
];

exports.up = function(db, callback) {
    db.createCollection(collectionNames[0], callback);
    db.createCollection(collectionNames[1], callback);
    db.createCollection(collectionNames[2], callback);
    db.createCollection(collectionNames[3], callback);
    db.createCollection(collectionNames[4], callback);
    db.createCollection(collectionNames[5], callback);
    db.createCollection(collectionNames[6], callback);
    db.createCollection(collectionNames[7], callback);
    db.createCollection(collectionNames[8], callback);
    db.createCollection(collectionNames[9], callback);
    db.createCollection(collectionNames[10], callback);
    db.createCollection(collectionNames[11], callback);
    db.createCollection(collectionNames[12], callback);
    db.createCollection(collectionNames[13], callback);
    db.createCollection(collectionNames[14], callback);
    db.createCollection(collectionNames[15], callback);
    db.createCollection(collectionNames[16], callback);
    db.createCollection(collectionNames[17], callback);
    db.createCollection(collectionNames[18], callback);
    db.createCollection(collectionNames[19], callback);
    db.createCollection(collectionNames[20], callback);
  
};

exports.down = function(db, callback) {
    db.dropCollection(collectionNames[0], callback);
    db.dropCollection(collectionNames[1], callback);
    db.dropCollection(collectionNames[2], callback);
    db.dropCollection(collectionNames[3], callback);
    db.dropCollection(collectionNames[4], callback);
    db.dropCollection(collectionNames[5], callback);
    db.dropCollection(collectionNames[6], callback);
    db.dropCollection(collectionNames[7], callback);
    db.dropCollection(collectionNames[8], callback);
    db.dropCollection(collectionNames[9], callback);
    db.dropCollection(collectionNames[10], callback);
    db.dropCollection(collectionNames[11], callback);
    db.dropCollection(collectionNames[12], callback);
    db.dropCollection(collectionNames[13], callback);
    db.dropCollection(collectionNames[14], callback);
    db.dropCollection(collectionNames[15], callback);
    db.dropCollection(collectionNames[16], callback);
    db.dropCollection(collectionNames[17], callback);
    db.dropCollection(collectionNames[18], callback);
    db.dropCollection(collectionNames[19], callback);
    db.dropCollection(collectionNames[20], callback);
};

exports._meta = {
  "version": 1
};
