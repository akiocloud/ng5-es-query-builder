import { Component, OnInit, OnChanges, Input, AfterViewInit, ViewChild, Output, EventEmitter } from "@angular/core";
// import { MatchQuery } from './queries/match.query';
// import { Match_phraseQuery } from './queries/match_phrase.query';
// import { Match_phase_prefixQuery } from './queries/match_phase_prefix.query';
// import { RangeQuery } from './queries/range.query';
// import { GtQuery } from './queries/gt.query';
// import { LtQuery } from './queries/lt.query';
// import { TermQuery } from './queries/term.query';
// import { ExistsQuery } from './queries/exists.query';
// import { TermsQuery } from './queries/terms.query';
// import { PrefixQuery } from './queries/prefix.query';
// import { MultiMatchQuery } from './queries/multi-match.query';
// import { QueryStringQuery } from './queries/query_string.query';
// import { SimpleQueryStringQuery } from './queries/simple_query_string.query';
// import { MissingQuery } from './queries/missing.query';
// import { WildcardQuery } from './queries/wildcard.query';
// import { RegexpQuery } from './queries/regexp.query';
// import { FuzzyQuery } from './queries/fuzzy.query';
// import { IdsQuery } from './queries/ids.query';
// import { CommonQuery } from './queries/common.query';
// import { GeoDistanceQuery } from './queries/geodistance.query';
// import { GeoBoundingBoxQuery } from './queries/geoboundingbox.query';
// import { GeoDistanceRangeQuery } from './queries/geodistancerange.query';
// import { GeoPolygonQuery } from './queries/geopolygon.query';
// import { GeoHashCellQuery } from './queries/geohashcell.query';
// import { GeoShapeQuery } from './queries/geoshape.query';
// import { SpanTermQuery } from './queries/span_term.query';
// import { SpanFirstQuery } from './queries/span_first.query';
declare var $: any;

@Component({
	selector: 'single-query',
	templateUrl: 'singlequery.component.html',
	styleUrls:[ 'singlequery.component.css' ],
	inputs: [
		'config', 'queryList', 'addQuery', 'internal', 'internalIndex', 'queryIndex', 'buildQuery', 'buildInsideQuery', 
		'buildSubQuery', 'createQuery', 'setQueryFormat'
	]
})

export class SinglequeryComponent implements OnInit, OnChanges, AfterViewInit {
	public config: any;
	public queryList: any = this.queryList;
	public addQuery: any;
	public removeArray: any = [];
	public internal: any;
	public internalIndex: number;
	public queryIndex: number;
	public buildQuery: any;
	public querySelector: any;
	public allFields: any;
	public selector = {
		field: 'field-select',
		query: 'query-select'
	};
	@Input() mapping: any;
	@Input() types: any;
	@Input() selectedTypes: any;
	@Input() result: any;
	@Input() query: any;
	@Input() compoundQueryName: string;
	
	// @ViewChild(MatchQuery) private matchQuery: MatchQuery;
	// @ViewChild(Match_phraseQuery) private match_phraseQuery: Match_phraseQuery;
	// @ViewChild(Match_phase_prefixQuery) private match_phase_prefixQuery: Match_phase_prefixQuery;
	// @ViewChild(RangeQuery) private rangeQuery: RangeQuery;
	// @ViewChild(GtQuery) private gtQuery: GtQuery;
	// @ViewChild(LtQuery) private ltQuery: LtQuery;
	// @ViewChild(TermQuery) private termQuery: TermQuery;
	// @ViewChild(TermsQuery) private termsQuery: TermsQuery;
	// @ViewChild(PrefixQuery) private prefixQuery: PrefixQuery;
	// @ViewChild(ExistsQuery) private existsQuery: ExistsQuery;
	// @ViewChild(MultiMatchQuery) private multiMatchQuery: MultiMatchQuery;
	// @ViewChild(QueryStringQuery) private queryStringQuery: QueryStringQuery;
	// @ViewChild(SimpleQueryStringQuery) private simpleQueryStringQuery: SimpleQueryStringQuery;
	// @ViewChild(MissingQuery) private missingQuery: MissingQuery;
	// @ViewChild(WildcardQuery) private wildcardQuery: WildcardQuery;
	// @ViewChild(RegexpQuery) private regexpQuery: RegexpQuery;
	// @ViewChild(FuzzyQuery) private fuzzyQuery: FuzzyQuery;
	// @ViewChild(IdsQuery) private idsQuery: IdsQuery;
	// @ViewChild(CommonQuery) private commonQuery: CommonQuery;
	// @ViewChild(GeoDistanceQuery) private geoDistanceQuery: GeoDistanceQuery;
	// @ViewChild(GeoBoundingBoxQuery) private geoBoundingBoxQuery: GeoBoundingBoxQuery;
	// @ViewChild(GeoDistanceRangeQuery) private geoDistanceRangeQuery: GeoDistanceRangeQuery;
	// @ViewChild(GeoPolygonQuery) private geoPolygonQuery: GeoPolygonQuery;
	// @ViewChild(GeoHashCellQuery) private geoHashCellQuery: GeoHashCellQuery;
	// @ViewChild(GeoShapeQuery) private geoShapeQuery: GeoShapeQuery;
	// @ViewChild(SpanTermQuery) private spanTermQuery: SpanTermQuery;
	// @ViewChild(SpanFirstQuery) private spanFirstQuery: SpanFirstQuery;
	
	public informationList: any = {};

	// on initialize set the query selector
	ngOnInit() {
		this.querySelector = '.query-' + this.queryIndex + '-' + this.internalIndex;
		this.allFields = this.result.resultQuery.availableFields.slice();
	}
	
	ngOnChanges() {
		this.allFields = this.result.resultQuery.availableFields.slice();
		this.querySelector = '.query-' + this.queryIndex + '-' + this.internalIndex;
		setTimeout(() => {
			this.result.resultQuery.availableFields = this.allFields;
			if(this.query.selectedField) {
				var isFieldExists = this.getField(this.query.selectedField);
				if(!isFieldExists.length) {
					this.removeQuery();
				}
			}
		}, 300);
	}

	ngAfterViewInit() {
		this.informationList = {
			// 'match': this.matchQuery.information,
			// 'match_phrase': this.match_phraseQuery.information,
			// 'match_phrase_prefix': this.match_phase_prefixQuery.information,
			// 'range': this.rangeQuery.information,
			// 'gt': this.gtQuery.information,
			// 'lt': this.ltQuery.information,
			// 'term': this.termQuery.information,
			// 'terms': this.termsQuery.information,
			// 'exists': this.existsQuery.information,
			// 'multi_match': this.multiMatchQuery.information,
			// 'query_string': this.queryStringQuery.information,
			// 'simple_query_string': this.simpleQueryStringQuery.information,
			// 'missing': this.missingQuery.information,
			// 'prefix': this.prefixQuery.information,
			// 'wildcard': this.wildcardQuery.information,
			// 'regexp': this.regexpQuery.information,
			// 'fuzzy': this.fuzzyQuery.information,
			// 'ids': this.idsQuery.information,
			// 'common': this.commonQuery.information,
			// 'geo_distance': this.geoDistanceQuery.information,
			// 'geo_bounding_box': this.geoBoundingBoxQuery.information,
			// 'geo_distance_range': this.geoDistanceRangeQuery.information,
			// 'geo_polygon': this.geoPolygonQuery.information,
			// 'geohash_cell': this.geoHashCellQuery.information,
			// 'geo_shape': this.geoShapeQuery.information,
			// 'span_term': this.spanTermQuery.information,
			// 'span_first': this.spanFirstQuery.information
		};
	}

	getQueryFormat(outputQuery) {
		this.query.appliedQuery = outputQuery;
		this.buildQuery();
	}

	// delete query
	removeQuery() {
		this.internal.splice(this.internalIndex, 1);
		this.buildQuery();
	}

	/*
	 * when editing via mat-select instead of old editable,
	 * reuse the existing logic after changing the value
	 */
	fieldSelectionChange() {
		for (let i in this.result.resultQuery.availableFields) {
			let field = this.result.resultQuery.availableFields[i];
			if ( field.name == this.query.selectedField ) {
				this.analyzeTest(i);
			}
		}
	}

	// field select - change event
	// On selecting the field, we are checking if field is analyzed or not
	// and according to that show the available query
	analyzeTest(res) {
		//$(res.selector).parents('.editable-pack').removeClass('on');
		this.query.field = this.result.resultQuery.availableFields[res]; // this.getField(res.val)[0];
		this.query.analyzeTest = this.query.field.index === 'not_analyzed' ? 'not_analyzed' : 'analyzed';
		this.query.type = this.query.field.type;
		this.query.selectedField = this.query.field.name; // res.val;
	}

	/*
	 * when editing via mat-select instead of old editable,
	 * rewrite the existing logic after changing the value
	 */
	querySelectionChange() {
		this.query.query = this.query.selectedQuery;
		this.buildQuery();
	}

	// Query select - change event
	queryCallback(res) {
		//res.selector.parents('.editable-pack').removeClass('on');
		this.query.query = this.queryList[this.query.analyzeTest][this.query.type][res];
		this.query.selectedQuery = this.queryList[this.query.analyzeTest][this.query.type][res];
		this.buildQuery();
	}

	// build the query
	// buildquery method is inside build.component
	exeBuild() {
		setTimeout(() => this.buildQuery(), 300);
	}

	getField(fieldName: any) {
		return this.result.resultQuery.availableFields.filter(function(ele: any) {
			return ele.name === fieldName;
		});
	}

	getAvailableQueries(){
		return	this
				.queryList[this.query.analyzeTest][this.query.type]
				/*
				.filter(q => {
					let isParentSpan = this.compoundQueryName.indexOf("span") > -1;
					let isChildSpan = q.indexOf("span") > -1;
					return isParentSpan == isChildSpan;
				})
				*/
				;
	}
}
