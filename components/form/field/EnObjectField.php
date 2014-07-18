<?php
/**
 * Description of EnObjectFIeld
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @version 0.1
 * @since 03.07.2013
 */

class EnObjectField extends ExtFormTriggerField
{
	/**
	 * Выполнять только стандартный обработчик нажатия кнопки.
	 * @var string
	 */
	public $onlyTrigger;

	/**
	 * Название датакласса, связанного набора данных.
	 * @var string
	 */
	public $storeRefId;

	/**
	 * Url, отправки запроса на обработку нажатия кнопки объектного поля.
	 * @var string
	 */
	public $actionUrl;

	/**
	 * Использовать и ограничения по ключю на создаваемые и обновляемые записи
	 * @var array
	 */
	public $useConstrain;

	/**
	 * Количество записей, которое можно выбрать в связанном наборе
	 * @var integer
	 */
	public $constrainCount;

	/**
	 * Название поля, значения которого необходимо передать для ограничения по ключу
	 * @var string
	 */
	public $constrainField;

	/**
	 * Название поля, по которому необхоимо исключить записи из списка ограничения
	 * @var string
	 */
	public $constrainLookup;

	/**
	 * Название НД для создания ограничения
	 * @var string
	 */
	public $constrainDs;

	public function initComponent()
	{
		parent::initComponent();
		$this->cmpClass = 'Common.form.field.TenObjectField';
		$this->xtype    = 'enobjectfield';
		if (is_null($this->onlyTrigger))
			$this->onlyTrigger = TRUE;
		$this->actionUrl = '/encore/window/showreference';
	}

}

