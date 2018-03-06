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
    "appname": "spotter_288_2017_12_en_1"
  };

  result = {
    "queryId": 1,
    "resultQuery": {
      "result": [],
      "availableFields": [
        {
          "name": "id",
          "type": "numeric",
          "index": null
        },
        {
          "name": "name",
          "type": "string",
          "index": "analyzed"
        },
        {
          "name": "location",
          "type": "geo_point",
          "index": "analyzed"
        }
      ]
    }
  }

}
