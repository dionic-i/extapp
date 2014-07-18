<?php
/**
 * Description of EnLinkView
 *
 * @author Ilya Petrushenko
 * @version 0.1
 * @since 13.12.2013
 */

class EnLinkView extends EnSostavView
{
	/**
	 * Url, по которому делать привязку объекта.
	 * @var string
	 */
	public $linkAction;

	/**
	 * Url, по которому открывается набор данных и курсор устанавливается на привязанную запись.
	 * @var string
	 */
	public $showAction;

	public function initComponent()
	{
		parent::initComponent();
		$this->cmpClass = 'Common.grid.TenLinkView';
		$this->xtype    = 'enlinkview';
		$this->createToolbars();
	}

	protected function createToolbars()
	{
		parent::createToolbars();

		$user = Yii::app()->user;

		$this->tbar->add(array(
			'xtype' => 'tbspacer',
			'width' => 30
		));

		if ($user->isAdmin())
		{
			$this->tbar->add(array(
				'iconCls' => 'i_link_object',
				'itemId'  => 'i_link',
				'tooltip' => 'Привязать объект',
				'handler' => 'acLink'
			));
		}

		$this->tbar->add(array(
			'iconCls' => 'i_show_object',
			'itemId'  => 'i_showobject',
			'tooltip' => 'Показать привязанный объект',
			'handler' => 'acShowLinkObject'
		));
	}
}
