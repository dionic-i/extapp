/**
 * @class Common.widenings.TenGraph
 * Класс панели графика с гридом для отображения легенд.
 *
 * @author Ilya Petrushenko
 * @version 0.1
 * @since 28.03.2013
 */

Ext.define('Common.panel.TenChartPanel', {

	extend: 'Ext.panel.Panel',
	alias : 'widget.enchartpanel',

	mixins: {
		tlbfactory: 'Common.toolbar.TenToolbarFactory'
	},

	initComponent: function () {
		var me = this;
		me.mixins.tlbfactory.createSuspended(me);
		me.createChart();
		me.items = [me.chart];
		me.callParent();
	},

	// @private
	createChart  : function () {
		var me = this,
			config = {
				//debug            : true,
				initAnimAfterLoad: false,
				chartConfig      : {
					chart      : {
						zoomType: 'x',
						type    : 'line',
						showAxes: true
					},
					title      : {
						text: 'График мощности'
					},
					xAxis      : [
						{
							title            : {
								text  : 'Дата-время',
								margin: 20
							},
							type             : 'datetime',
							tickmarkPlacement: 'on',
							labels           : {
								rotation : 45,
								y        : 50,
								formatter: function () {
									var value = new Date();
									value.setTime(this.value);
									return Ext.Date.format(value, "d.m H:i");
								}
							}
						}
					],
					yAxis      : {
						title      : {
							text: 'Значение(кВт, кВар)'
						},
						startOnTick: false
					},
					plotOptions: {
						series: {
							lineWidth: 1,
							marker   : {
								enabled: false,
								states : {
									hover: {
										enabled: true,
										radius : 4
									}
								}
							},
							shadow   : false,
							states   : {
								hover: {
									lineWidth: 2
								}
							}
						}
					},
					tooltip    : {
						formatter: function () {
							var value = new Date();
							value.setTime(this.x);
							return  '<b>График: </b>' + this.series.name + '<br/>' +
								'<b>Дата : </b>' + Ext.Date.format(value, 'Y-m-d H:i:s') + '<br/>' +
								'<b>Значение : </b>' + this.y;
						}

					},
					legend     : {
						layout       : 'vertical',
						align        : 'right',
						verticalAlign: 'top',
						x            : -10,
						y            : 100,
						borderWidth  : 0
					},
					credits    : {
						text : 'Е-ресурс 2.0',
						href : 'http://po-energoresurs.ru',
						style: {
							cursor  : 'pointer',
							color   : '#707070',
							fontSize: '12px'
						}
					}
				}
			};

		me.chart = Ext.create('Chart.ux.Highcharts', config);
	},

	existSeries: function () {
		return this.chart.series.length !== 0;
	},

	acShowLegends: function (btn, checked) {
		var me = this, i = 0,
			series = me.chart.chart.series;
		if (checked) {
			for (; i < series.length; i++) {
				series[i].show();
			}
		}
		else {
			for (; i < series.length; i++) {
				series[i].hide();
			}
		}
	},

	removeSeries: function () {
	},

	addSeries: function (series, invSeries) {
		var me = this, i = 0;
		me.chart.addSeries(series);

		// После добавления серий необходимо скрыть серии, которые были невидимые до перезагрузки
		if (invSeries) {
			for (; i < invSeries.length; i++) {
				me.chart.chart.series[invSeries[i]].hide();
			}
		}
	},

	/**
	 * Метод получения списка серий графиков.
	 * @param {boolean} inner Серии ExtJs компонента или HighCharts
	 */
	getChartSeries: function (inner) {
		var me = this;
		if (inner && me.chart.hasOwnProperty('chart')) {
			return me.chart.chart.series;
		}
		else {
			return me.chart.series;
		}
	},

	setTitle: function (title) {
		this.chart.setTitle(title);
	},

	destroy: function () {
		var me = this;
		delete me.innerLegends;
		delete me.innerFields;
		delete me.chart;
		me.callParent();
	}

});