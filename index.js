
import { GraphDatabase } from neo4j
import firebase

import { firebaseConfig } from './config'

firebase.intializeApp(firebaseConfig);
const firedb = bfirebase.database()

// var firebase = require('firebase/app');
// require('firebase/auth');
// require('firebase/database');
// var app = firebase.intializeApp({ ... });
// // ...

const neodb = GraphDatabase('http://neo4j:p2Vjdkk@localhost:7474');


firedb.ref('connections').on('child_added', data =>
  
  const connData = data.values();
  const fbids = data.key.split('facebook:')
  // const fbidA = `facebook:${fbids[1]}`
  // const fbidB = `facebook:${fbids[2]}`

  const gotUser1 = new Promise((resolve, reject) => {
    firedb.ref(`users/facebook:${fbids[1]}`).once('value', resolve)
  })

  const gotUser2 = new Promise((resolve, reject) => {
    firedb.ref(`users/facebook:${fbids[2]}`).once('value', resolve)
  })

  Promise.all([gotUser1, gotUser2])

    .then((snapshot1, snapshot2)=> {

      neodb.cypher({ 
        // Note that we do NOT use the template string literals to do var insertion
        // we use the `params` part of neo4j's client lib
        query: `MERGE (u1:User {id: {id1}})
                ON CREATE SET u1.email = {email1}, u1.displayName = {displayName1}
                MERGE (u2:User {id: {id2}})
                ON CREATE SET u2.email = {email2}, u2.displayName = {displayName2}
                MERGE (u1)-[conn:SHARED_WITH]->(u2)
                ON CREATE SET conn.latitude = {latitude}, conn.longitude = {longitude}, conn.timestamp = {timestamp}
                RETURN u1, conn, u2
                `,
        params: {
          id1: snapshot1.id,
          displayName1: snapshot1.displayName,
          email1: snapshot1.email,
          id2: snapshot2.id,
          displayName2: snapshot2.displayName,
          email2: snapshot2.email,

          latitude: connData.latitude,
          longitude: connData.longitude,
          timestamp: connData.timestamp
        },

      }, function (err, results) {
        if (err) throw err;
        var result = results[0];
        if (!result) {
          console.log('No user found.');
        } else {
          var user = result['u'];
          console.log(JSON.stringify(user, null, 4));
        }

      });




    })





})

