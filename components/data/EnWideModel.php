<?php
/**
 * Description of EnWideModel
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @version 0.1
 * @since 27.06.2013
 */

class EnWideModel extends ExtModel
{
	/**
	 * Название класса модели данных
	 * @var string
	 */
	public $modelClass;

	public function initComponent()
	{
		parent::initComponent();
		$this->cmpClass = 'Common.data.TenWideModel';
		if (is_null($this->extend))
			$this->extend = 'Common.data.TenWideModel';
	}

}

