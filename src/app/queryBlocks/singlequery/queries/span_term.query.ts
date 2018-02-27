import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild, SimpleChange } from "@angular/core";

@Component({
    selector: 'span-term-query',
    templateUrl: 'span_term.query.html',
    inputs: ['getQueryFormat', 'querySelector']
})

export class SpanTermQuery implements OnInit, OnChanges {
    // Initialize the variables
    @Input() queryList;
    @Input() selectedField;
    @Input() appliedQuery;
    @Input() selectedQuery;
    @Output() getQueryFormat = new EventEmitter<any>();
    public queryName = '*';
    public fieldName = '*';
    public current_query = 'span_term';

    public information: any = {
        title: 'Span Term',
        content: `<span class="description">Matches spans containing a term. The span term query maps to Lucene SpanTermQuery.</span>
                    <a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-term-query.html#query-dsl-span-term-query">Read more</a>`
    };
    public informationList: any = {
        'boost': {
            title: 'boost',
            content: `<span class="description">Sets the boost value of the query, defaults to <strong>1.0</strong></span>`
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

    constructor() {}

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
            if (this.appliedQuery[this.current_query][this.selectedField]) {
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
            }
        } catch (e) {}
        this.getFormat();
    }

    ngOnChanges() {
        if (this.selectedField != '') {
            if (this.selectedField !== this.fieldName) {
                this.fieldName = this.selectedField;
                this.getFormat();
            }
        }
        if (this.selectedQuery != '') {
            if (this.selectedQuery !== this.queryName) {
                this.queryName = this.selectedQuery;
                this.getFormat();
            }
        }
    }

    getFormat() {
        if (this.queryName === this.current_query) {
            this.queryFormat = this.setFormat();
            this.getQueryFormat.emit(this.queryFormat);
        }
    }
    
    setFormat() {
        var queryFormat = {};
        queryFormat[this.queryName] = {
            [this.fieldName]: {}
        };
        if (this.optionRows.length) {
            queryFormat[this.queryName][this.fieldName]['value'] = this.inputs.input.value;
            this.optionRows.forEach(function(singleRow: any) {
                queryFormat[this.queryName][this.fieldName][singleRow.name] = singleRow.value
            }.bind(this))
        } else {
            queryFormat[this.queryName][this.fieldName]['value'] = this.inputs.input.value;
        }
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
