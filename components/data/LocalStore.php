<?php
/**
 * Description of ExtLocalStore
 * Класс локального набора данных ExtJs.
 *
 * @author Ilya Petrushenko
 * @version 0.1
 * @since 13.06.2013
 */

namespace dionici\extapp\components\data;

class LocalStore extends Store
{
	/**
	 * Локальные данные набора
	 * @var array
	 */
	public $localData;

	public function initComponent()
	{
		parent::initComponent();
		$this->cmpClass = 'Common.data.TenLocalStore';
	}

}
