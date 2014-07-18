<?php
/**
 * Descritpnio of EnStore
 * Класс хранилищ данных ExtJs.
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @version 0.1
 * @since 01.01.2013
 */

class EnStore extends ExtStore
{
	/**
	 * Иденификатор модели данных (не уникален, выставляется названием набора, например: TenSrez)
	 * @var string
	 */
	public $uid;

	/**
	 * Идентификатор набора данных. По данному названию в ExtJS можно получить
	 * ссылку на набор данных из глобального менеджера наборов.
	 * @var string
	 */
	public $storeId;

	/**
	 * Список названий полей, которые необходимо исключить из отправки в updateRecords
	 * @var array
	 */
	public $excludeFields;

	public function initComponent()
	{
		parent::initComponent();
		$this->cmpClass = 'Common.data.TenStore';
		Ext::applyIf($this, array(
			'autoLoad' => FALSE,
			'autoSync' => FALSE
		));
	}
}
