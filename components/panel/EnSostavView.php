<?php
/**
 * Description of EnSostavView
 * Обязательные поля:
 *        sostavName - Название набора данных для отображения состава.
 *
 * @author Ilya Petrushenko
 * @version 0.1
 * @since 01.11.2013
 */

class EnSostavView extends EnGridView
{
	/**
	 * Url, по которому открывать связанный набор данных.
	 * @var string
	 */
	public $sostavAction;

	public function initComponent()
	{
		parent::initComponent();
		$this->cmpClass = 'Common.grid.TenSostavView';
		$this->xtype    = 'ensostavview';
		$this->createToolbars();
	}

	protected function createToolbars()
	{
		parent::createToolbars();

		$items = array(
			array(
				'iconCls' => 'i_sostav',
				'itemId'  => 'i_trans_sostav',
				'tooltip' => 'Состав',
				'handler' => 'acSostav'
			)
		);

		$this->bbar = new ExtToolbar(array(
			'xtype'    => 'toolbar',
			'itemId'   => 'gridbbar',
			'defaults' => array(
				'xtype' => 'button'
			),
			'items'    => $items
		));

		$this->suspendProps[] = 'bbar';
	}

	public function setBbar($value)
	{
		parent::setBbar($value);
		if (is_null($this->bbar) && is_null($this->tbar))
			$this->suspendProps = array();
	}

}
