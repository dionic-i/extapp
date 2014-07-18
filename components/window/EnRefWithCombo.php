<?php
/**
 * Description of EnRefWithCombo.
 *
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 14.01.14 15:53
 */

class EnRefWithCombo extends EnRefUniversal
{
	/**
	 * Название НД combobox
	 * @var string
	 */
	public $spgName;

	/**
	 * Набора данных combobox
	 * @var EnSimpleDataset
	 */
	public $comboStore;

	/**
	 * Идентификатор набора данных combobox
	 * @var string
	 */
	public $comboStoreId;

	/**
	 * Настройки поля combobox в верхнем toolbar
	 * @var array
	 */
	public $comboConfig;

	public function initComponent()
	{
		parent::initComponent();
		$this->_notExt[] = 'spgName';
		$this->_notExt[] = 'comboStore';
		$this->_notExt[] = 'comboConfig';
		$this->cmpClass  = 'Common.wins.winRefWithCombo';
		$this->xtype     = 'winrefwithcombo';
		$this->createToolbar();
	}

	public function createToolbar()
	{
		parent::createToolbar();

		if (empty($this->spgName))
			throw new BaseException('Ошибка создания компонента winRefWithCombo. Не определено свойство "spgName"');

		$this->comboStore   = Yii::app()->enStore->createDs($this->spgName);
		$this->comboStoreId = $this->comboStore->dataset->uid;

		if (!is_array($this->comboConfig))
			throw new BaseException('Ошибка создания компонента winRefWithCombo. Не определено свойство "comboConfig"');

		$this->comboConfig = array_merge(array(
			'xtype'         => 'combobox',
			'itemId'        => 'i_combo_gr',
			'store'         => $this->comboStoreId,
			'valueField'    => 'ID',
			'displayField'  => 'NAME',
			'triggerAction' => 'all',
			'allowBlank'    => FALSE,
			'labelAlign'    => 'left',
			'labelWidth'    => 65,
			'fieldLabel'    => 'Группы',
			'emptyText'     => '---',
			'width'         => 250,
			'editable'      => FALSE
		), $this->comboConfig);

		$this->tbar->insertAt($this->comboConfig, 1);
	}

}
