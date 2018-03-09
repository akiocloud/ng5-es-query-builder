import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'lt-query',
	templateUrl: 'lt.query.html',
	inputs: ['getQueryFormat', 'querySelector']
})

export class LtQuery implements OnInit, OnChanges {
	@Input() queryList;
	@Input() selectedField;
	@Input() appliedQuery;
	@Input() selectedQuery;
	@Output() getQueryFormat = new EventEmitter<any>();
	public queryName = '*';
	public fieldName = '*';
	public current_query = 'lt';
	public information: any = {
		title: 'Less Than',
		content: `<span class="description">Returns term values less than the specified value. </span>
					<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html#query-dsl-range-query">Read more</a>`
	};
	public informationList: any = {
		'boost': {
			title: 'boost',
			content: `<span class="description">Sets the boost value of the query, defaults to <strong>1.0</strong> </span>`
		}
	};
	public default_options: any = [
		'boost'
	];
	public options: any;
	public singleOption = {
		name: '',
		value: ''
	};
	public optionRows: any = [];
	public inputs: any = {
		lt: {
			placeholder: 'Less than',
			value: ''
		}
	};
	public queryFormat: any = {};

	ngOnInit() {
		this.options = JSON.parse(JSON.stringify(this.default_options));
		try {
			if(this.appliedQuery['range'][this.fieldName]['lt']) {
				this.inputs.lt.value = this.appliedQuery['range'][this.fieldName]['lt']
				for (let option in this.appliedQuery[this.current_query][this.fieldName]) {
					if (option != 'lt') {
						var obj = {
							name: option,
							value: this.appliedQuery[this.current_query][this.fieldName][option]
						};
						this.optionRows.push(obj);
					}
				}
			}
		} catch(e) {}
		this.getFormat();
	}

	ngOnChanges() {
		if(this.selectedField != '') {
			if(this.selectedField !== this.fieldName) {
				this.fieldName = this.selectedField;
				this.getFormat();
			}
		}
		if(this.selectedQuery != '') {
			if(this.selectedQuery !== this.queryName) {
				this.queryName = this.selectedQuery;
				this.getFormat();
				this.optionRows = [];
			}
		}
	}
	// QUERY FORMAT
	/*
		Query Format for this query is
		range: {
			@fieldName: {
				lt: @from_value
			}
		}
	*/
	getFormat() {
		if (this.queryName === 'lt') {
			this.queryFormat = this.setFormat();
			this.getQueryFormat.emit(this.queryFormat);
		}
	}
	setFormat() {
		var queryFormat = {
			'range': {}
		}
		queryFormat['range'][this.fieldName] = {
			lt: this.inputs.lt.value,
		};
		this.optionRows.forEach(function(singleRow: any) {
			queryFormat['range'][this.fieldName][singleRow.name] = singleRow.value;
		}.bind(this));
		return queryFormat;
	}
	selectOption(input: any) {
		setTimeout(function() {
			this.getFormat();
		}.bind(this), 300);
	}
	addOption() {
		var singleOption = JSON.parse(JSON.stringify(this.singleOption));
		this.optionRows.push(singleOption);
	}
	removeOption(index: Number) {
		this.optionRows.splice(index, 1);
		this.getFormat();
	}
}
