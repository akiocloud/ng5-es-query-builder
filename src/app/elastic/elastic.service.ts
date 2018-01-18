import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ElasticService {

  constructor(private http: Http) {}

  public getMapping( endpoint:String) {
    return this.http.get( endpoint + "/_mapping");
  }

}
