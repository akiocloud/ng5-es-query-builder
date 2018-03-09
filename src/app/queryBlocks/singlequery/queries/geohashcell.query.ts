import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'geohash-cell-query',
    templateUrl: 'geohashcell.query.html',
    inputs: ['getQueryFormat', 'querySelector']
})

export class GeoHashCellQuery implements OnInit, OnChanges {
    @Input() queryList;
    @Input() selectedField;
    @Input() appliedQuery;
    @Input() selectedQuery;
    @Output() getQueryFormat = new EventEmitter<any>();
    public queryName = '*';
    public fieldName = '*';
    public current_query = 'geohash_cell';
    public information: any = {
        title: 'Geohash Cell Query',
        content: `<span class="description">Returns geo_point matches in proximity of the specified geohash cell.<br><br>
				A geohash cell is defined by setting additional properties to the geo_point mapping type.</span>
                    <a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geohash-cell-query.html#query-dsl-geohash-cell-query">Read more</a>`
    };
    public informationList: any = {
        'neighbors': {
            title: 'neighbors',
            content: `<span class="description">When set to <strong>true</strong>, it returns matches next to the specified geohash cell.</span>`
        }
    };
    public default_options: any = [
        'neighbors'
    ];
    public options: any;
    public singleOption = {
        name: '',
        value: ''
    };
    public optionRows: any = [];
    public inputs: any = {
        lat: {
            placeholder: 'Latitude',
            value: ''
        },
        lon: {
            placeholder: 'Longitude',
            value: ''
        },
        precision: {
            placeholder: 'Precision',
            value: ''
        }
    };
    public queryFormat: any = {};

    ngOnInit() {
        this.options = JSON.parse(JSON.stringify(this.default_options));
        try {
            if(this.appliedQuery[this.current_query][this.fieldName]['lat']) {
                this.inputs.lat.value = this.appliedQuery[this.current_query][this.fieldName]['lat'];
            }
            if(this.appliedQuery[this.current_query][this.fieldName]['lon']) {
                this.inputs.lon.value = this.appliedQuery[this.current_query][this.fieldName]['lon'];
            }
            if(this.appliedQuery[this.current_query]['precision']) {
                this.inputs.precision.value = this.appliedQuery[this.current_query]['precision'];
            }
            for (let option in this.appliedQuery[this.current_query][this.fieldName]) {
                if (option != 'lat' && option != 'lon') {
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
        var queryFormat = {
            [this.queryName]: {
                [this.fieldName]: {
                    lat: this.inputs.lat.value,
                    lon: this.inputs.lon.value
                },
                precision: this.inputs.precision.value
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
