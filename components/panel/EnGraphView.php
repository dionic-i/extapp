<?php
/**
 * Description of EnGraphView
 *
 * Обязательные поля:
 *        itemId - Локальный идентификатор компонента, он необходим для установки
 *                свойства окну с таким названием.
 *        storeId - Название датакласса, т.к. по нему привязывается store
 *        leftFields - Массив полей данных оси ординат
 *        bottomField - Название поля данных оси аббцисс
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @version 0.1
 * @since 25.04.2013
 */

class EnGraphView extends ExtPanel
{
	/**
	 * Идентификатор набора данных
	 * @var string
	 */
	public $storeId;

	/**
	 * @var string
	 */
	public $animate;

	/**
	 * Настройки легенды
	 * @var array
	 */
	public $legend;

	/**
	 * Список названий полей оси ординат
	 * @var array
	 */
	public $leftFields;

	/**
	 * Список названий легенд
	 * @var array
	 */
	public $legendNames;

	/**
	 * Название поля оси аббцисс
	 * @var string
	 */
	public $bottomField;

	/**
	 * Название главной легенды.
	 * При первой загрузке графиков отображется только данная легенда. Остальные выключены.
	 * @var string
	 */
	public $mainLegend;

	public function initComponent()
	{
		parent::initComponent();
		$this->cmpClass = 'Common.panel.TenChartPanel';
		$this->xtype    = 'enchartpanel';
		$this->layout   = 'fit';
		$this->setNullProperty('title', 'График');
	}

	protected function createToolbars()
	{
		$this->tbar           = new ExtToolbar(array(
			'itemId' => 'charttoolbar',
			'items'  => array(
				array(
					'xtype'         => 'button',
					'iconCls'       => 'i_show_legends',
					'itemId'        => 'i_show_legends',
					'tooltip'       => 'Показать/скрыть графики',
					'enableToggle'  => TRUE,
					'pressed'       => TRUE,
					'toggleHandler' => 'acShowLegends',
				)
			)
		));
		$this->suspendProps[] = 'tbar';
	}
}
