import { Component , OnInit } from '@angular/core';
import { ElasticService } from './elastic/elastic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit
{
  public endpoint : String = "http://10.93.201.249:9200/spotter_288_2017_12_en_1";
  public mapping : any;
  public types = [ "document" ];
  public selectedTypes = [ "document" ];

  constructor(private elasticService: ElasticService) {}

  ngOnInit(){
    this.elasticService.getMapping(this.endpoint).toPromise().then( response => {
      this.mapping = response.json();
    });

  }
  
  config = {
    // "url": "http://10.93.201.249:9200",
    "appname": "spotter_288_2017_12_en_1",
    // "username": "10.93.201.249",
    // "password": "9200",
    // "host": "http://10.93.201.249:9200"
  };

  _result = {
    "queryId" : 1,
    "resultQuery": {
      // "type": "",
      "result": [],
      "availableFields": [
        {
          "name": "id",
          "type": "string",
          "index": null
        },
        {
          "name": "name",
          "type": "string",
           "index": "analyzed"
        }
      ]
      // "final": "{\n  \"query\": {\n    \"match_all\": {}\n  }\n}"
    },
    // "sort": [],
    // "joiningQuery": [
    //   "",
    //   "nested"
    // ]
  };

  result = {
    "queryId": 3,
    "resultQuery": {
      "result": [
        {
          "boolparam": "must_not",
          "parent_id": 0,
          "id": 1,
          "internal": [
            {
              "field": {
                "name": "name",
                "type": "string",
                "index": "analyzed"
              },
              "query": "match",
              "selectedField": "name",
              "selectedQuery": "match",
              "input": "",
              "analyzeTest": "analyzed",
              "type": "string",
              "appliedQuery": {
                "match": {
                  "name": "joao"
                }
              }
            }
          ],
          "minimum_should_match": "",
          "path": "",
          "type": "",
          "xid": 0,
          "parent_type": "",
          "score_mode": "",
          "availableQuery": [
            {
              "match": {
                "name": "joao"
              }
            }
          ]
        },
        {
          "boolparam": "span_near",
          "parent_id": 0,
          "id": 2,
          "internal": [
            {
              "field": {
                "name": "name",
                "type": "string",
                "index": "analyzed"
              },
              "query": "span_term",
              "selectedField": "name",
              "selectedQuery": "span_term",
              "input": "",
              "analyzeTest": "analyzed",
              "type": "string",
              "appliedQuery": {
                "span_term": {
                  "name": {
                    "value": "pedro"
                  }
                }
              }
            }
          ],
          "minimum_should_match": "",
          "path": "",
          "type": "",
          "xid": 0,
          "parent_type": "",
          "score_mode": "",
          "availableQuery": [
            {
              "span_term": {
                "name": {
                  "value": "pedro"
                }
              }
            }
          ]
        }
      ],
      "availableFields": [
        {
          "name": "id",
          "type": "string",
          "index": null
        },
        {
          "name": "name",
          "type": "string",
          "index": "analyzed"
        }
      ],
      "final": "{\n  \"query\": {\n    \"bool\": {\n      \"must_not\": [\n        {\n          \"match\": {\n            \"name\": \"joao\"\n          }\n        }\n      ],\n      \"span_near\": [\n        {\n          \"span_term\": {\n            \"name\": {\n              \"value\": \"pedro\"\n            }\n          }\n        }\n      ]\n    }\n  }\n}"
    },
    "joiningQuery": [
      "",
      "nested"
    ]
  }

}
