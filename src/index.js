import { GraphDatabase } from 'neo4j'
import * as firebase from 'firebase'

import { firebaseServiceConfig as firebaseConfig } from './config'

firebase.initializeApp(firebaseConfig)

const firedb = firebase.database()

// var firebase = require('firebase/app');
// require('firebase/auth');
// require('firebase/database');
// var app = firebase.intializeApp({ ... });
// // ...

const neodb = new GraphDatabase('http://neo4j:p2Vjdkk@localhost:7474')


firedb.ref('connections').on('child_added', data => {

  const connData = data.val()

  // console.log('haschild:', data.hasChild())

  const userKeys = data.key.split('::::')
  // const fbidA = `facebook:${fbids[1]}`
  // const fbidB = `facebook:${fbids[2]}`
  console.log('Users connected:', userKeys)

  const gotUser1 = new Promise((resolve) => {
    firedb.ref(`users/${userKeys[0]}`).once('value', function(snapshot) {
      resolve(snapshot)
    })
  })

  const gotUser2 = new Promise((resolve) => {
    firedb.ref(`users/${userKeys[1]}`).once('value', function(snapshot) {
      resolve(snapshot)
    })
  })


  Promise.all([gotUser1, gotUser2])

    .then((snapshots) => {
      const snapshot1 = snapshots[0].val()
      const snapshot2 = snapshots[1].val()

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

      }, function(err, results) {
        console.log('cypher result return')
        if (err) throw err
        var result = results[0]
        if (!result) {
          console.log('No user found.')
        } else {
          console.log(result)
        }

      })




    })





})

