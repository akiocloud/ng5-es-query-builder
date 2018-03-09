import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'geo-distance-range-query',
    templateUrl: 'geodistancerange.query.html',
    inputs: ['getQueryFormat', 'querySelector']
})

export class GeoDistanceRangeQuery implements OnInit, OnChanges {
    @Input() queryList;
    @Input() selectedField;
    @Input() appliedQuery;
    @Input() selectedQuery;
    @Output() getQueryFormat = new EventEmitter<any>();
    public queryName = '*';
    public fieldName = '*';
    public current_query = 'geo_distance_range';
    public information: any = {
        title: 'Geo Distance Range Query',
        content: `<span class="description">Filters documents that exists within a range from a specific geo point.</span>
                    <a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-distance-range-query.html#query-dsl-geo-distance-range-query">Read more</a>`
    };
		public informationList: any = {
        'distance_type': {
            title: 'distance_type',
            content: `<span class="description">How to compute the distance. Can either be <strong>sloppy_arc</strong> (default), <strong>arc</strong>
                        (slightly more precise but significantly slower) or <strong>plane</strong> (faster, but inaccurate on long distances and close to the poles).</span>`
        },
        'optimize_bbox': {
            title: 'optimize_bbox',
            content: `<span class="description">Defaults to <strong>memory</strong> which will do in memory bounding box checks before the distance check. Can also have values of <strong>indexed</strong> to use indexed value check, or <strong>none</strong> which disables bounding box optimization.</span>`
        },
        '_name': {
            title: '_name',
            content: `<span class="description">Optional name field to identify the query.</span>`
        },
        'ignore_malformed': {
            title: 'ignore_malformed',
            content: `<span class="description">Set to <strong>true</strong> to accept geo points with invalid latitude or longitude (default is <strong>false</strong>).</span>`
        }
    };
		public default_options: any = [
				'distance_type',
				'optimize_bbox',
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
        lat: {
            placeholder: 'Latitude',
            value: ''
        },
        lon: {
            placeholder: 'Longitude',
            value: ''
        },
        from: {
            placeholder: 'From (with unit)',
            value: ''
        },
        to: {
            placeholder: 'To (with unit)',
            value: ''
        }
    };
    public queryFormat: any = {};

    ngOnInit() {
        try {
            if(this.appliedQuery[this.current_query][this.fieldName]['lat']) {
                this.inputs.lat.value = this.appliedQuery[this.current_query][this.fieldName]['lat'];
            }
            if(this.appliedQuery[this.current_query][this.fieldName]['lon']) {
                this.inputs.lon.value = this.appliedQuery[this.current_query][this.fieldName]['lon'];
            }
            if(this.appliedQuery[this.current_query][this.fieldName]['from']) {
                this.inputs.from.value = this.appliedQuery[this.current_query][this.fieldName]['from'];
            }
            if(this.appliedQuery[this.current_query][this.fieldName]['to']) {
                this.inputs.to.value = this.appliedQuery[this.current_query][this.fieldName]['to'];
            }
            for (let option in this.appliedQuery[this.current_query][this.fieldName]) {
                if (option != 'lat' && option != 'lon' && option != 'from' && option != 'to') {
                    var obj = {
                        name: option,
                        value: this.appliedQuery[this.current_query][this.fieldName][option]
                    };
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
                from: this.inputs.from.value,
                to: this.inputs.to.value
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
