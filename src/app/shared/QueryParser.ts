import { ChangeDetectorRef } from "@angular/core";
import { MessageService } from "./message.service";

export class QueryParser 
{

    constructor( private result : any, private messageService : MessageService ){}

    getSort(): any 
    {
        return this.result.sort;
    }

    getDefinitions(): any 
    {    
		return this.result.resultQuery.result;
    }

    public parse()
    {
        
        //reset existing errors before new parsing
        // for (let definition of this.getDefinitions()) 
        // {
        //     delete definition.errors;
        // }
        //this.messageService.reset();

        var root = {id:0};
        var queries = this.parseChildDefinitions(root);
        var query = queries && queries.length ? queries[0] : null;
        if ( query ) {
            var sort = this.parseSort();
            if ( sort && sort.length ) {
                query.sort = sort;
            }
        }
        return query;
    }

    private parseSort()
    {
        var clauses = null;
        if ( this.getSort() && this.getSort().length )
        {
            clauses = [];
            for ( let s of this.getSort() ) 
            {
                var clause = {};
                clause[s.selectedField] = {
                    "order" : s.order
                };
                clauses.push( clause );
            }
        }
        return clauses;
    }

    private getChildDefinitions(parent_id: number) 
    {
        var children = [];
        for (let definition of this.getDefinitions()) 
        {
            if (definition.parent_id == parent_id) 
            {
                children.push(definition);
            }
        }
        return children;
    }

    public isSpanQuery( definition : any ) : boolean 
    {
        return definition.boolparam && definition.boolparam.startsWith('span');
    }

    public isBoolQuery( definition : any ) : boolean 
    {
        return ['must','must_not','should','filter'].some( x => x == definition.boolparam );
    }

    public parseChildDefinitions( parent : any )
    {
        let queries = [];
        let must = null;
        let must_not = null;
        let should = null;
        let filter = null;
        //var errors = [];
        let childDefinitions = this.getChildDefinitions( parent.id );
        this.messageService.getMessages(parent.id).next( new Array<string>() );

        if ( childDefinitions.length )
        {
            for ( let definition of childDefinitions )
            {
                if ( this.isBoolQuery(definition) && this.isSpanQuery(parent) )
                {
                    //errors.push("bool queries are not allowed inside span queries");
                    this.messageService.put(parent.id,"bool queries are not allowed inside span queries");
                    break;
                }
                else // if ( this.isBoolQuery(definition) )
                {
                    if (definition.boolparam == 'must') 
                    {
                        if ( must == null )
                        {
                            must = this.parseMust(definition);
                        }
                        else
                        {
                            this.messageService.put(parent.id,"bool query cannot accept more than one 'must' clauses");
                            break;   
                        }
                    }
                    else if (definition.boolparam == 'must_not') 
                    {
                        if ( must_not == null )
                        {
                            must_not = this.parseMustNot(definition);
                        }
                        else
                        {
                            this.messageService.put(parent.id,"bool query cannot accept more than one 'must_not' clauses");
                            break;   
                        }
                    }
                    else if (definition.boolparam == 'should') 
                    {
                        if ( should == null )
                        {
                            should = this.parseShould(definition);
                        }
                        else
                        {
                            this.messageService.put(parent.id,"bool query cannot accept more than one 'should' clauses");
                            break;   
                        }
                    }
                    else if (definition.boolparam == 'filter') 
                    {
                        if ( filter == null )
                        {
                            filter = this.parseFilter(definition);
                        }
                        else
                        {
                            this.messageService.put(parent.id,"bool query cannot accept more than one 'filter' clauses");
                            break;   
                        }
                    }
                    else if ( definition.boolparam == 'span_near' )
                    {
                        queries.push( this.parseSpanNear(definition) )
                    }
                    else if ( definition.boolparam == 'span_or' )
                    {
                        queries.push( this.parseSpanOr(definition) )
                    }
                }
                 
            }
        }

        if ( must || must_not || should || filter )
        {
            var bool:any = {};
            if ( must )
            {
                bool.must = must;
            }
            if ( must_not )
            {
                bool.must_not = must_not;
            }
            if ( should )
            {
                bool.should = should;
            }
            if ( filter )
            {
                bool.filter = filter;
            }
            queries.push({bool:bool});
        }

        if ( ! parent.parent_id && queries.length > 1 )
        {
            this.messageService.put(parent.id,"cannot have more than one top level query");
        }
        return queries;

    }

    private parseMust(definition: any) 
    {
        var must = [];
        for ( let internal of definition.internal ) 
        {
            must.push( internal["appliedQuery"] );
        }
        var children = this.parseChildDefinitions( definition );
        if ( children && children.length )
        {
            for ( let child of children )
            {
                must.push( child );
            }
        }
        return must;
    }

    private parseMustNot(definition: any) 
    {
        var mustNot = [];
        for ( let internal of definition.internal ) 
        {
            mustNot.push( internal["appliedQuery"] );
        }
        var children = this.parseChildDefinitions( definition );
        if ( children && children.length )
        {
            for ( let child of children )
            {
                mustNot.push( child );
            }
        }
        return mustNot;
    }

    private parseShould(definition: any) 
    {
        var should = [];
        for ( let internal of definition.internal ) 
        {
            should.push( internal["appliedQuery"] );
        }
        var children = this.parseChildDefinitions( definition );
        if ( children && children.length )
        {
            for ( let child of children )
            {
                should.push( child );
            }
        }
        return should;
    }

    private parseFilter(definition: any) 
    {
        var filter = [];
        for ( let internal of definition.internal ) 
        {
            filter.push( internal["appliedQuery"] );
        }
        var children = this.parseChildDefinitions( definition );
        if ( children && children.length )
        {
            for ( let child of children )
            {
                filter.push( child );
            }
        }
        return filter;
    }

    private parseSpanNear(definition: any) 
    {
        var clauses = [];

        for ( let internal of definition.internal ) 
        {
            clauses.push( internal["appliedQuery"] );
        }
        var children = this.parseChildDefinitions( definition );
        if ( children && children.length )
        {
            for ( let child of children )
            {
                clauses.push( child );
            }
        }
        
        var span_near:any = { 'clauses' : clauses };

        if ( definition.slop )
        {
            span_near.slop = definition.slop;
        }
        if ( definition.in_order !== undefined )
        {
            span_near.in_order = definition.in_order;
        }

        return { span_near : span_near };

    }

    private parseSpanOr(definition: any) 
    {
        var clauses = [];

        for ( let internal of definition.internal ) 
        {
            clauses.push( internal["appliedQuery"] );
        }
        var children = this.parseChildDefinitions( definition );
        if ( children && children.length )
        {
            for ( let child of children )
            {
                clauses.push( child );
            }
        }
        
        var span_or:any = { 'clauses' : clauses };

        return { span_or : span_or };

    }
}
