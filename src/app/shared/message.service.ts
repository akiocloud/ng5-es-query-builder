import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MessageService 
{

  private messages : Map<number,BehaviorSubject<string[]>> = new Map();

  public getMessages(parentId:number):BehaviorSubject<string[]>
  {
    if ( ! this.messages[parentId] )
    {
      this.messages[parentId] = new BehaviorSubject( new Array<string>() );
    }
    return this.messages[parentId];
  }
  
  public put( parentId : number , message : string )
  {
    console.log("put",parentId,message);
    let messages = this.messages[parentId].getValue();
    
    messages.push(message);
    messages.push("test message");
    this.messages[parentId].next( messages );
  }

}
