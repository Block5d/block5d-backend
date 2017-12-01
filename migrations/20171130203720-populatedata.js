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
    'org-chart',
    'person',
    'project-members',
    'project-smart-contracts',
    'project-submission',
    'projects',
    'supporting-docs',
    'upload-models',
    'user-group',
    'user-permission',
    'web-form',
    'web-form-dep',
    'web-form-fields',
    'web-form-fields-metadata',
    'web-form-validation',
    'workflow'
];

exports.up = function(db, callback) {
    db.insert(collectionNames[0], require('../data/codes.json'), callback);
    db.insert(collectionNames[1], require('../data/company.json'), callback);
    db.insert(collectionNames[2], require('../data/org-chart.json'), callback);
    db.insert(collectionNames[3], require('../data/person.json'), callback);
    db.insert(collectionNames[4], require('../data/project-members.json'), callback);
    db.insert(collectionNames[5], require('../data/project-smart-contracts.json'), callback);
    db.insert(collectionNames[6], require('../data/project-submission.json'), callback);
    db.insert(collectionNames[7], require('../data/projects.json'), callback);
    db.insert(collectionNames[8], require('../data/support-docs.json'), callback);
    db.insert(collectionNames[9], require('../data/upload-models.json'), callback);
    db.insert(collectionNames[10], require('../data/user-group.json'), callback);
    db.insert(collectionNames[11], require('../data/user-permission.json'), callback);
    db.insert(collectionNames[12], require('../data/web-form.json'), callback);
    db.insert(collectionNames[13], require('../data/web-form-dep.json'), callback);
    db.insert(collectionNames[14], require('../data/web-form-fields.json'), callback);
    db.insert(collectionNames[15], require('../data/web-form-fields-metadata.json'), callback);
    db.insert(collectionNames[16], require('../data/web-form-validation.json'), callback);
    db.insert(collectionNames[17], require('../data/workflow.json'), callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
