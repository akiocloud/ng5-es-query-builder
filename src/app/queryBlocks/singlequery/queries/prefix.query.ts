import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'prefix-query',
	templateUrl: 'prefix.query.html',
	inputs: [ 'getQueryFormat', 'querySelector']
})

export class PrefixQuery implements OnInit, OnChanges {
	@Input() queryList;
	@Input() selectedField;
	@Input() appliedQuery;
	@Input() selectedQuery;
	@Output() getQueryFormat = new EventEmitter<any>();
	public current_query = 'prefix';
	public queryName = '*';
	public fieldName = '*';
	public information: any = {
		title: 'Prefix',
		content: `<span class="description">Returns results based on term prefix match.</span>
					<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/2.4/query-dsl-prefix-query.html#query-dsl-prefix-query">Read more</a>`
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
		input: {
			placeholder: 'Input',
			value: ''
		}
	};
	public queryFormat: any = {};

	ngOnInit() {
		this.options = JSON.parse(JSON.stringify(this.default_options));
		try {
			if(this.appliedQuery[this.current_query][this.fieldName]) {
				if (this.appliedQuery[this.current_query][this.fieldName].hasOwnProperty('value')) {
					this.inputs.input.value = this.appliedQuery[this.current_query][this.fieldName].value;
					for (let option in this.appliedQuery[this.current_query][this.fieldName]) {
						if (option != 'value') {
							var obj = {
								name: option,
								value: this.appliedQuery[this.current_query][this.fieldName][option]
							};
							this.optionRows.push(obj);
						}
					}
				} else {
					this.inputs.input.value = this.appliedQuery[this.current_query][this.fieldName];
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
		@queryName: {
			@fieldName: @value
		}
	*/
	getFormat() {
		if (this.queryName === this.current_query) {
			this.queryFormat = this.setFormat();
			this.getQueryFormat.emit(this.queryFormat);
		}
	}
	setFormat() {
		var queryFormat = {};
		queryFormat[this.queryName] = {};
		if (this.optionRows.length) {
			queryFormat[this.queryName][this.fieldName] = {
				value: this.inputs.input.value
			};
			this.optionRows.forEach(function(singleRow: any) {
				queryFormat[this.queryName][this.fieldName][singleRow.name] = singleRow.value;
			}.bind(this))
		} else {
			queryFormat[this.queryName][this.fieldName] = this.inputs.input.value;
		}
		return queryFormat;
	}
	selectOption() {
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
