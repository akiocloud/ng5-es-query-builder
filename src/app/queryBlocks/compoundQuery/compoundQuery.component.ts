import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'compound-query',
	templateUrl: 'compoundQuery.component.html',
	inputs: [
		'config', 'query', 'queryList', 'addQuery', 'removeQuery', 'addCompoundQuery', 
		'queryFormat', 'buildQuery', 'buildInsideQuery', 'buildSubQuery', 'createQuery', 
		'setQueryFormat', 'setDocSample']
})	//	, 'editorHookHelp', 'urlShare'

export class CompoundQueryComponent implements OnInit, OnChanges {

	public config: Object;
	public queryList: any = this.queryList;
	public addQuery: any;
	public addCompoundQuery: any;
	public removeQuery: any;
	public removeArray: any = [];
	public query: any = this.query;
	public buildQuery: any;
	public allFields: any;
	
	@Input() mapping: any;
	@Input() types: any;
	@Input() selectedTypes: any;
	@Input() result: any;
	
	ngOnInit() {
		this.allFields = this.result.resultQuery.availableFields;
		this.exeBuild();
	}

	ngOnChanges() {
		this.allFields = this.result.resultQuery.availableFields;
	}

	addSubQuery(id: number) {
		this.addCompoundQuery(id);
	}
	removeInQuery(id: number) {
		var resulQueries = this.result.resultQuery.result;
		this.removeArray.push(id);
		var removeFlag = true;
		resulQueries.forEach(function(v: any, i: number) {
			if (v.parent_id == id) {
				this.removeInQuery(v.id);
				removeFlag = false;
			}
		}.bind(this));

		if (removeFlag) {
			this.removeArray.forEach(function(remove_q: number) {
				resulQueries.forEach(function(v: any, i: number) {
					if (v.id == remove_q) {
						resulQueries.splice(i, 1);
					}
				}.bind(this));
			}.bind(this));
		}
		this.buildQuery();
	}
	exeBuild() {
		setTimeout(() => this.buildQuery(), 300);
	}
}
