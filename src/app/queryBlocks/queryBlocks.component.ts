import { Component, OnInit, OnChanges, EventEmitter, Input, Output } from "@angular/core";
import { queryList } from "../shared/queryList";
import { QueryParser } from "../shared/QueryParser";

declare var $: any;

@Component({
	selector: 'query-blocks',
	templateUrl: 'queryBlocks.component.html',
	styleUrls: ['queryBlocks.component.css'],
	inputs: ['detectChange', 'saveQuery', 'setProp']
})

export class QueryBlocksComponent implements OnInit {
	public queryList: any = queryList;
	public queryFormat: any = {
		internal: {
			field: '',
			query: '',
			selectedField: '',
			selectedQuery: '',
			input: '',
			analyzeTest: '',
			type: ''
		},
		bool: {
			boolparam: 'must',
			parent_id: 0,
			id: 0,
			internal: [],
			minimum_should_match: '',
			path: '',
			type: '',
			xid: 0,
			parent_type: '',
			score_mode: ''
		}
	};
	@Input() mapping: any;
	@Input() types: any;
	@Input() selectedTypes: any;
	@Input() result: any;
	@Input() query_info: any;
	@Input() config: any;
	@Output() setProp = new EventEmitter < any > ();

	ngOnInit() {
	}

	// Add the boolean query
	// get the default format for query and internal query
	// set the format and push into result array
	addCompoundQuery(parent_id: number) {
		if (this.selectedTypes) {
			var queryObj = JSON.parse(JSON.stringify(this.queryFormat.bool));
			var internalObj = JSON.parse(JSON.stringify(this.queryFormat.internal));
			queryObj.internal.push(internalObj);
			queryObj.id = this.result.queryId;
			queryObj.parent_id = parent_id;
			this.result.queryId += 1;
			this.result.resultQuery.result.push(queryObj);
			this.buildQuery();
		} else {
			alert('Select type first.');
		}
	}

	removeQuery() {
		this.result.resultQuery.result = [];
		this.buildQuery();
	}

	addSortBlock() {
		let sortObj = {
            'selectedField': '',
            'order': 'asc',
            'availableOptionalParams': []
        }
        this.result.sort.push(sortObj);
	}

	removeSortBlock() {
		this.result.sort = [];
		this.buildQuery();
	}

	// add internal query
	addQuery(compoundQuery) {
		var self = this;
		var queryObj = JSON.parse(JSON.stringify(self.queryFormat.internal));
		compoundQuery.internal.push(queryObj);
		this.buildQuery();
	}

	// builquery - this function handles everything to build the query
	buildQuery() {
		var results = this.result.resultQuery.result;
		var sort = this.result.sort;
		var queryParser = new QueryParser(results,sort);
		this.result.resultQuery.parsed = queryParser.parse();
	}

	buildInsideQuery(result) {
		var objChain = [];
		result.internal.forEach(function(val0) {
			var childExists = false;
			val0.appliedQuery = this.createQuery(val0, childExists);
		}.bind(this));
		result.internal.forEach(function(val) {
			objChain.push(val.appliedQuery)
		});
		return objChain;
	}

	buildSubQuery() {
		var result = this.result.resultQuery.result[0];
		result.forEach(function(val0) {
			if (val0.parent_id != 0) {
				result.forEach(function(val1) {
					if (val0.parent_id == val1.id) {
						val1.appliedQuery['bool']['must'].push(val0.appliedQuery);
					}
				}.bind(this));
			}
		}.bind(this));
	}

	// Createquery until query is selected
	createQuery(val, childExists) {
		var queryParam = {
			query: '*',
			field: '*',
			queryFlag: true,
			fieldFlag: true
		};

		if (val.analyzeTest === '' || val.type === '' || val.query === '') {
			queryParam.queryFlag = false;
		}
		if (val.field === '') {
			queryParam.fieldFlag = false;
		}

		if (queryParam.queryFlag) {
			return val.appliedQuery;
		} else {
			if (queryParam.fieldFlag) {
				queryParam.field = val.selectedField;
			}
			var sampleobj = this.setQueryFormat(queryParam.query, queryParam.field, val);
			return sampleobj;
		}
	}

	setQueryFormat(query, field, val) {
		var sampleobj = {};
		sampleobj[query] = {};
		sampleobj[query][field] = val.input;
		return sampleobj;
	}

	toggleSortQuery() {
		if (this.result.sort) {
			if (this.result.sort.length < 1 && this.selectedTypes.length > 0) {
				this.addSortBlock();
			} else {
				this.removeSortBlock();
			}
		} else {
			this.result.sort = [];
			this.addSortBlock();
		}
	}

	setPropIn(propObj: any) {
		this.setProp.emit(propObj);
	}

	changeMode(mode) {
		const propInfo = {
			name: 'responseMode',
			value: mode
		};
		this.setProp.emit(propInfo);
	}
}
