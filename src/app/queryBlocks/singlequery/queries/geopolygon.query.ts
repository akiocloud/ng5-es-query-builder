import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'geo-polygon-query',
    templateUrl: 'geopolygon.query.html',
    inputs: ['getQueryFormat', 'querySelector']
})

export class GeoPolygonQuery implements OnInit, OnChanges {
    @Input() queryList;
    @Input() selectedField;
    @Input() appliedQuery;
    @Input() selectedQuery;
    @Output() getQueryFormat = new EventEmitter<any>();
    public queryName = '*';
    public fieldName = '*';
    public current_query = 'geo_polygon';
    public information: any = {
        title: 'Geo Polygon Query',
        content: `<span class="description">Return matches that fall within a specified polygon shape.</span>
                    <a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-polygon-query.html#query-dsl-geo-polygon-query">Read more</a>`
    };
    public informationList: any = {
        '_name': {
            title: '_name',
            content: `<span class="description">Optional name field to identify the query.</span>`
        },
        'ignore_malformed': {
            title: 'ignore_malformed',
            content: `<span class="description">Set to <strong>true</strong> to accept geo points with invalid latitude or longitude (default is false).</span>`
        }
    };
    public default_options: any = [
        '_name',
        'ignore_malformed'
    ];
    public options: any;
    public singleOption = {
        name: '',
        value: ''
    };
    public optionRows: any = [];
    public inputs: any = {
        points: {
            placeholder: 'points',
            value: ''
        }
    };
    public queryFormat: any = {};

    ngOnInit() {
        this.options = JSON.parse(JSON.stringify(this.default_options));
        try {
            if(this.appliedQuery[this.current_query][this.fieldName]['points']) {
                this.inputs.points.value = this.appliedQuery[this.current_query][this.fieldName]['points'];
            }
            for (let option in this.appliedQuery[this.current_query][this.fieldName]) {
                if (option != 'points') {
                    var obj = {
                        name: option,
                        value: this.appliedQuery[this.current_query][this.fieldName][option]
                    };
                    this.optionRows.push(obj);
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
                this.optionRows = [];
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
        var points =  this.inputs.points.value;
        try {
            points = JSON.parse(points);
        } catch(e) {}
        var queryFormat = {
            [this.queryName]: {
                [this.fieldName]: {
                    points: points
                }
            }
        };
        this.optionRows.forEach(function(singleRow: any) {
            queryFormat[this.queryName][singleRow.name] = singleRow.value;
        }.bind(this));
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
