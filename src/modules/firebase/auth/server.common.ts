// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: 'angular-universal-consulting',
//     clientEmail: 'firebase-adminsdk-5dap9@angular-universal-consulting.iam.gserviceaccount.com',
//     privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCjbmYPKtRgkOOv\n4IVPJGw2I1h2Gf7wSdT9Ohn7mkjag659LEoAa9i0XS5cgV+7gZe3VvNOFNFYvUuX\nB32eSt3qPGATuveJtjG27Qvr3KmJQWIirEWsLFBHK3kv6DiLX3sUgqbD9A8Y5BrN\nN41D1N5m/RTQWIbvbrlpc7CRDI4UOTI+cx4aJ7eDgO6SHlrIacrQNAi09yMqnt04\n3ec8END0+DTTkUrB+kOFa7tYPHDyTrGLbscO0kIWfCZYCU0RwSRP1OP442mRVMkY\nqZiMNzOGZ7fCumVZ6lTfWV0QwGI1+O44GkX3ZlPMi7kJCaKQXnjCDsFUR9MBLEtJ\n76JEVzqXAgMBAAECggEAIMj1ylciMZj/Q/n7ZCv/VUDz7wU6AkQdaQstyS5jLQq7\nhzrKQZlg6JXExiPh64CMyee0eVZtxKp8rnh/N7D3IZUpBOw92i9le7fD63XhwLoQ\nELqUY3ykQhKzhevE5BisXSn0gFzGZozj34UkXpYmY2yjr0QDFacVpNTjd8WX/vBE\nVHoq3YnqRFIYFfdqu2TeLN/5ytW0R1z6Iu9DQUoQ+/qxUKcDr2CnLbgNyF/0xC7M\nZrLZvrDsPPcuFvJ+OEf190bridf27HCIgx8CduSACJaBLRWT23VsPk6mhVtMC6+q\nQFXxSQrl3bsokapNR4CwYQdHpn9fA5hXOIUYW4CN+QKBgQDPGFOi1C+94qp0T7R7\nXoHUzX9V9qbbUkCpiIqFW8EEvI+BV6lzxzv/IF4wN2GNjlmNyynTnpXgabREW1w9\nXX9tk6NBtzaWCSLZn9RDg964EFkZZuV7QgxadqcNm7EmepT0IaeeM+KEJn8R/d1v\nUMECS/IPtMe1LoLdmE6f4Rq2CwKBgQDKBm6hCRVmudo6T9HwBu/k/zenm+qJXhj4\nAijGDK6zFLkOjGRge+UuXVFk4HJDA+32aQeB+7iddN5BUe7ftbGxdBw8z7bl3ewD\nEVQuf8nPvBt5i4EWjCEzpI5PTSUrqvYxvS8TMRS5dSeJpOhXRpYzsmyELfBJEjZB\nJPTH4bqhJQKBgQCzmAMf2Cc24tSzXVPFESZCZ5uf7vCwjlopK5IFKJbxBpzkrCL1\nlrf+/hDwe3aMDgC3qJIzRPnwzXpZNWl+hhC19CzGFp6t6mpgk+y+SCPjN7os/0DP\nbW3NHcytTnGITxHRzUXROmmb9M6JycA4gq1+0mGvITV3eEhg52530/0YFQKBgQC/\nVBYj1sl471zYys2FZ9x8YKThzMzzabV18/2Pi2VMXrzgJV/O7KdhIKm8QsCT7T3J\nlzCwDqiKHqt661Cyd44hBFjV0tZhnqotQZUbMJT9cyYGF3Oa2f17vkW0ntgsIg5l\njsjtgRciiOx39EDCnywTK9CP4j3lxiSxz4EvZ/1rLQKBgAbtfcy1ypdyO9bnODVn\nzzP1ldNJSXowTpqRjtCyqelGZMX+85IXb4Yg3pB+8MGbWj0pTNN5Dot3fgL+flTu\nhQJ0+OMgVXsYWHU00WyZpA0nmpXsDrZDRN6S9V1Iyyhuff3oxCP7RQvEiTKG76y5\nTr1hsyrNNkELTGx0wJioUKO1\n-----END PRIVATE KEY-----\n'
//   }),
//   databaseURL: 'https://angular-universal-consulting.firebaseio.com'
// })

// providers: [{
//   provide: AngularFireAuth,
//   useFactory: (http: HttpClient, cs: CookieService) => {
//     const firebaseIdToken = cs.get('firebaseJwt')
//     // verify a token symmetric
//     // return admin.auth().verifyIdToken(cs.get('firebaseJwt'))
//     //   .then(function (decodedToken) {
//     //     return {
//     //       user: of(decodedToken)
//     //     }
//     //   }).catch(function (error) {
//     //     return {
//     //       user: of(undefined)
//     //     }
//     //   })
//     return {
//       user: firebaseIdToken ? of(admin.auth().verifyIdToken(firebaseIdToken)).pipe(flatMap(a => a)) : of(null),
//       idToken: firebaseIdToken ? of(firebaseIdToken) : of(null),
//     }
//   },
//   deps: [HttpClient, CookieService]
// }]
