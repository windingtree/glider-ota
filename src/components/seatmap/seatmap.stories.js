import React from 'react';
import SeatMap from './seatmap'

export default {
  title: 'Seatmap/SeatMap',
};

const smallCabin = {
  layout: 'ABC DEF',
  name: 'VIP',
  firstRow: 1,
  lastRow: 2,
  wingFirst: 1,
  wingLast: 2,
  seats: [
      {
          "number": "1A",
          "available": true,
          "characteristics": [
              "PS",
              "W"
          ],
          "optionCode": "A0"
      },
      {
          "number": "1B",
          "available": false,
          "characteristics": [
              "PS",
              "W"
          ]
      },
      {
          "number": "1C",
          "available": false,
          "characteristics": [
              "PS",
              "W"
          ]
      },
      {
          "number": "1D",
          "available": false,
          "characteristics": [
              "PS",
              "W"
          ]
      },
      {
          "number": "1E",
          "available": false,
          "characteristics": [
              "PS",
              "W"
          ]
      },
      {
          "number": "1F",
          "available": false,
          "characteristics": [
              "PS",
              "W"
          ]
      },
      {
          "number": "2B",
          "available": true,
          "characteristics": [
              "PS",
              "W"
          ],
          "optionCode": "A1"
      },
      {
          "number": "2C",
          "available": true,
          "characteristics": [
              "PS",
              "W"
          ],
          "optionCode": "A1"
      },
      {
          "number": "2D",
          "available": true,
          "characteristics": [
              "PS",
              "W"
          ],
          "optionCode": "A1"
      },
      {
          "number": "2E",
          "available": true,
          "characteristics": [
              "PS",
              "W"
          ],
          "optionCode": "A1"
      },
  ],
  prices: {
      "A0": {
          "currency": "CAD",
          "public": "0.00",
          "taxes": "0.00"
      },
      "A1": {
          "currency": "CAD",
          "public": "50.00",
          "taxes": "0.00"
      },
  }
};

const largeCabin = {
  layout: 'ABC DEFG HJK',
  name: 'Economy',
  firstRow: 18,
  lastRow: 64,
  wingFirst: 18,
  wingLast: 38,
  seats: [
    {
        "number": "18A",
        "available": true,
        "characteristics": [
            "PS",
            "W"
        ],
        "optionCode": "A1"
    },
    {
        "number": "18B",
        "available": true,
        "characteristics": [
            "N",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "18C",
        "available": true,
        "characteristics": [
            "A",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "18D",
        "available": true,
        "characteristics": [
            "A",
            "B",
            "K",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "18E",
        "available": true,
        "characteristics": [
            "N",
            "K",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "18F",
        "available": true,
        "characteristics": [
            "N",
            "K",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "18G",
        "available": true,
        "characteristics": [
            "A",
            "K",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "18H",
        "available": false,
        "characteristics": [
            "A",
            "PS"
        ]
    },
    {
        "number": "18J",
        "available": true,
        "characteristics": [
            "N",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "18K",
        "available": true,
        "characteristics": [
            "PS",
            "W"
        ],
        "optionCode": "A1"
    },
    {
        "number": "19A",
        "available": false,
        "characteristics": [
            "W"
        ]
    },
    {
        "number": "19B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "19C",
        "available": false,
        "characteristics": [
            "A",
            "H"
        ]
    },
    {
        "number": "19D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "19E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "19F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "19G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "19H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "19J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "19K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "20A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "20B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "20C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "20D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "20E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "20F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "20G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "20H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "20J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "20K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "21A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "21B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "21C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "21D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "21E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "21F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "21G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "21H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "21J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "21K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "22A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "22B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "22C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "22D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "22E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "22F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "22G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "22H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "22J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "22K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "23A",
        "available": true,
        "characteristics": [
            "LA",
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "23B",
        "available": true,
        "characteristics": [
            "LA",
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "23C",
        "available": true,
        "characteristics": [
            "LA",
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "23D",
        "available": true,
        "characteristics": [
            "LA",
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "23E",
        "available": true,
        "characteristics": [
            "LA",
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "23F",
        "available": true,
        "characteristics": [
            "LA",
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "23G",
        "available": true,
        "characteristics": [
            "LA",
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "23H",
        "available": true,
        "characteristics": [
            "LA",
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "23J",
        "available": true,
        "characteristics": [
            "LA",
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "23K",
        "available": true,
        "characteristics": [
            "LA",
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "30D",
        "available": true,
        "characteristics": [
            "A",
            "K",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "30E",
        "available": true,
        "characteristics": [
            "N",
            "K",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "30F",
        "available": true,
        "characteristics": [
            "N",
            "K",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "30G",
        "available": true,
        "characteristics": [
            "A",
            "B",
            "K",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "31A",
        "available": true,
        "characteristics": [
            "1A",
            "IE",
            "PS",
            "W"
        ],
        "optionCode": "A1"
    },
    {
        "number": "31B",
        "available": true,
        "characteristics": [
            "1A",
            "N",
            "IE",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "31C",
        "available": true,
        "characteristics": [
            "1A",
            "A",
            "H",
            "IE",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "31D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "31E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "31F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "31G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "31H",
        "available": true,
        "characteristics": [
            "1A",
            "A",
            "H",
            "IE",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "31J",
        "available": true,
        "characteristics": [
            "1A",
            "N",
            "IE",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "31K",
        "available": true,
        "characteristics": [
            "1A",
            "IE",
            "PS",
            "W"
        ],
        "optionCode": "A1"
    },
    {
        "number": "32A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "32B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "32C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "32D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "32E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "32F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "32G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "32H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "32J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "32K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "33A",
        "available": false,
        "characteristics": [
            "W"
        ]
    },
    {
        "number": "33B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "33C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "33D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "33E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "33F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "33G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "33H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "33J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "33K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "34A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "34B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "34C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "34D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "34E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "34F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "34G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "34H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "34J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "34K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "35A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "35B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "35C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "35D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "35E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "35F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "35G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "35H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "35J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "35K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "36A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "36B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "36C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "36D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "36E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "36F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "36G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "36H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "36J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "36K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "37A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "37B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "37C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "37D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "37E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "37F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "37G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "37H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "37J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "37K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "38A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "38B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "38C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "38D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "38E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "38F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "38G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "38H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "38J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "38K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "39A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "39B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "39C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "39D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "39E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "39F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "39G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "39H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "39J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "39K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "40A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "40B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "40C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "40D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "40E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "40F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "40G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "40H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "40J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "40K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "41A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "41B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "41C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "41D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "41E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "41F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "41G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "41H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "41J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "41K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "42A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "42B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "42C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "42D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "42E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "42F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "42G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "42H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "42J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "42K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "43A",
        "available": true,
        "characteristics": [
            "LA",
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "43B",
        "available": true,
        "characteristics": [
            "LA",
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "43C",
        "available": true,
        "characteristics": [
            "LA",
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "43D",
        "available": true,
        "characteristics": [
            "GN",
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "43E",
        "available": true,
        "characteristics": [
            "GN",
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "43F",
        "available": true,
        "characteristics": [
            "GN",
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "43G",
        "available": true,
        "characteristics": [
            "GN",
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "43H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "43J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "43K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "44H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "44J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "44K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "45H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "45J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A2"
    },
    {
        "number": "45K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A2"
    },
    {
        "number": "50D",
        "available": true,
        "characteristics": [
            "A",
            "B",
            "K",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "50E",
        "available": true,
        "characteristics": [
            "N",
            "K",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "50F",
        "available": true,
        "characteristics": [
            "N",
            "K",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "50G",
        "available": true,
        "characteristics": [
            "A",
            "K",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "51A",
        "available": false,
        "characteristics": [
            "1A",
            "IE",
            "PS",
            "W"
        ]
    },
    {
        "number": "51B",
        "available": true,
        "characteristics": [
            "1A",
            "N",
            "IE",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "51C",
        "available": true,
        "characteristics": [
            "1A",
            "A",
            "H",
            "IE",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "51D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A2"
    },
    {
        "number": "51E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "51F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "51G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "51H",
        "available": true,
        "characteristics": [
            "1A",
            "A",
            "H",
            "IE",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "51J",
        "available": true,
        "characteristics": [
            "1A",
            "N",
            "IE",
            "PS"
        ],
        "optionCode": "A1"
    },
    {
        "number": "51K",
        "available": false,
        "characteristics": [
            "1A",
            "IE",
            "PS",
            "W"
        ]
    },
    {
        "number": "52A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    },
    {
        "number": "52B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "52C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "52D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "52E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "52F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "52G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "52H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "52J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "52K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    },
    {
        "number": "53A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    },
    {
        "number": "53B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "53C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "53D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "53E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "53F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "53G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "53H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "53J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "53K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    },
    {
        "number": "54A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    },
    {
        "number": "54B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "54C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "54D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "54E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "54F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "54G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "54H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "54J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "54K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    },
    {
        "number": "55A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    },
    {
        "number": "55B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "55C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "55D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "55E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "55F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "55G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "55H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "55J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "55K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    },
    {
        "number": "56A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    },
    {
        "number": "56B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "56C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "56D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "56E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "56F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "56G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "56H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "56J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "56K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    },
    {
        "number": "57A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    },
    {
        "number": "57B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "57C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "57D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "57E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "57F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "57G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "57H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "57J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "57K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    },
    {
        "number": "58A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    },
    {
        "number": "58B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "58C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "58D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "58E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "58F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "58G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "58H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "58J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "58K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    },
    {
        "number": "59A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    },
    {
        "number": "59B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "59C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "59D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "59E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "59F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "59G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "59H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "59J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "59K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    },
    {
        "number": "60A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    },
    {
        "number": "60B",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "60C",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "60D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "60E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "60F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "60G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "60H",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "60J",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "60K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    },
    {
        "number": "61A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    },
    {
        "number": "61B",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "61D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "61E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "61F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "61G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "61J",
        "available": false,
        "characteristics": [
            "A",
            "H"
        ]
    },
    {
        "number": "61K",
        "available": false,
        "characteristics": [
            "W"
        ]
    },
    {
        "number": "62A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    },
    {
        "number": "62B",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "62D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "62E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "62F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "62G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "62J",
        "available": false,
        "characteristics": [
            "A",
            "H"
        ]
    },
    {
        "number": "62K",
        "available": false,
        "characteristics": [
            "W"
        ]
    },
    {
        "number": "63A",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    },
    {
        "number": "63B",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "63D",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "63E",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "63F",
        "available": true,
        "characteristics": [
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "63G",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "63J",
        "available": false,
        "characteristics": [
            "A",
            "H"
        ]
    },
    {
        "number": "63K",
        "available": false,
        "characteristics": [
            "W"
        ]
    },
    {
        "number": "64A",
        "available": false,
        "characteristics": [
            "W"
        ]
    },
    {
        "number": "64B",
        "available": false,
        "characteristics": [
            "A",
            "H"
        ]
    },
    {
        "number": "64D",
        "available": true,
        "characteristics": [
            "GN",
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "64E",
        "available": true,
        "characteristics": [
            "GN",
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "64F",
        "available": true,
        "characteristics": [
            "GN",
            "N"
        ],
        "optionCode": "A0"
    },
    {
        "number": "64G",
        "available": true,
        "characteristics": [
            "GN",
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "64J",
        "available": true,
        "characteristics": [
            "A",
            "H"
        ],
        "optionCode": "A0"
    },
    {
        "number": "64K",
        "available": true,
        "characteristics": [
            "W"
        ],
        "optionCode": "A0"
    }
  ],
  prices: {
    "A0": {
        "currency": "CAD",
        "public": "0.00",
        "taxes": "0.00"
    },
    "A1": {
        "currency": "CAD",
        "public": "50.00",
        "taxes": "0.00"
    },
    "A2": {
        "currency": "CAD",
        "public": "20.00",
        "taxes": "0.00"
    },
  }
};

const segmentOneStop = {
    stops: ['Moscow','Doha','Puhket'],
    flightTime: '10h 15min',
    index: 1,
};

const segmentNonStop = {
    stops: ['Brussels','Montreal'],
    flightTime: '8h 35min',
    index: 0,
};

const adultAndChild = [
    {
        type: 'ADT',
        name: 'Doe John'
    },
    {
        type: 'CHD',
        name: 'Doe Johnny'
    },
];

const family = [
    {
        type: 'ADT',
        name: 'Doe John'
    },
    {
        type: 'ADT',
        name: 'Doe Catherine'
    },
    {
        type: 'CHD',
        name: 'Doe Johnny'
    },
    {
        type: 'CHD',
        name: 'Doe Johnnette'
    },
];

const largeGroup = [
    {
        type: 'ADT',
        name: 'ONE John'
    },
    {
        type: 'ADT',
        name: 'TWO Catherine'
    },
    {
        type: 'ADT',
        name: 'THREE John'
    },
    {
        type: 'ADT',
        name: 'FOUR Catherine'
    },
    {
        type: 'ADT',
        name: 'FIVE John'
    },
    {
        type: 'ADT',
        name: 'SIX Catherine'
    },
    {
        type: 'ADT',
        name: 'SEVEN Bob'
    },
    {
        type: 'CHD',
        name: 'EIGHT Johnny'
    },
    {
        type: 'CHD',
        name: 'NINE Johnnette'
    },
];

export const smallCabinSeatMapOneStop = () => (
    <SeatMap
      cabin={smallCabin}
      segment={segmentOneStop}
      passengers={adultAndChild}
      initialPrice={1164.65}
      currency='CAD'
      handleSeatMapContinue={console.log}
      handleSeatMapSkip={console.log}
    />
);

export const largeCabinSeatMap = () => (
  <SeatMap
    cabin={largeCabin}
    segment={segmentNonStop}
    passengers={adultAndChild}
    initialPrice={1164.65}
    currency='CAD'
    handleSeatMapContinue={console.log}
    handleSeatMapSkip={console.log}
  />
);

export const largeCabinSeatMapWithFamily = () => (
    <SeatMap
      cabin={largeCabin}
      segment={segmentNonStop}
      passengers={family}
      initialPrice={1164.65}
      currency='CAD'
      handleSeatMapContinue={console.log}
      handleSeatMapSkip={console.log}
    />
);

export const largeCabinSeatMapWithLargeGroup = () => (
    <SeatMap
      cabin={largeCabin}
      segment={segmentNonStop}
      passengers={largeGroup}
      initialPrice={1164.65}
      currency='CAD'
      handleSeatMapContinue={console.log}
      handleSeatMapSkip={console.log}
    />
);



