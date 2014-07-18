<?php
/**
 * Description of EnFormWindow.
 * Класс для создания окон с формами внутри.
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 31.01.14 16:44
 */

class EnTabsFormWindow extends EnUniversal
{
	/**
	 * Использовать вкладки для расоложения форм на окне
	 * @var boolean
	 */
	public $useTabs;

	/**
	 * Список имен форм для навигации по ним
	 * @var array
	 */
	public $formNames;

	/**
	 * Url для сохранения формы
	 * @var string
	 */
	public $saveUrl;

	/**
	 * Закрывать после успешного сохранения изменений
	 * @var boolean
	 */
	public $closeAfterSuccessSave;

	public function initComponent()
	{
		$this->formNames = array();

		parent::initComponent();
		$this->cmpClass = 'Common.wins.winTabsForm';
		$this->xtype    = 'wintabsform';
		$this->createToolbar();

		Ext::applyIf($this, array(
			'width'                 => 400,
			'height'                => 400,
			'modal'                 => TRUE,
			'closeAfterSuccessSave' => TRUE
		));
	}

	protected function createToolbar()
	{
		$this->suspendProps[] = 'tbar';
		$this->tbar           = new ExtToolbar(array(
			'xtype'    => 'toolbar',
			'itemId'   => 'wintoolbar',
			'defaults' => array('xtype' => 'button'),
			'items'    => array(
				array(
					'iconCls'  => 'i_save',
					'itemId'   => 'i_save',
					'tooltip'  => 'Сохранить изменения',
					'handler'  => 'acSave',
					'disabled' => TRUE
				),
				array('xtype' => 'tbfill'),
				array(
					'iconCls' => 'i_exit',
					'itemId'  => 'i_exit',
					'tooltip' => 'Выход',
					'handler' => 'acExit'
				)
			)
		));
	}

	/**
	 * Метод добаления формы на окно
	 * @param $name string Название компонента
	 * @param $config array Конфигурация ExtJs
	 * @return mixed
	 */
	public function addForm($name, $config)
	{
		if (is_array($config) && count($config) > 0)
		{
			if (array_key_exists('viewClass', $config))
			{
				$vclass = $config['viewClass'];
				unset($config['viewClass']);
			}
			else
				$vclass = 'ExtFormPanel';
		}
		else if (is_string($config) && strlen($config) > 0 && class_exists($config))
			$vclass = $config;
		else
			$vclass = 'ExtFormPanel';

		$form = new $vclass(array(
			'itemId' => $name,
			'margin' => '5'
		));

		// Установка полей ??? Не совсем понятно почему setItems не срабатывает автоматом
		$_items = FALSE;
		if (array_key_exists('items', $config))
		{
			$_items = $config['items'];
			unset($config['items']);
		}

		// Установка остальных свойств
		if (is_array($config) && count($config) > 0)
		{
			foreach ($config as $prop => $value)
				$form->$prop = $value;
		}

		if ($_items)
			$form->setItems($_items);

		$this->formNames[] = $name;
		$this->add($form);

		return $form;
	}
}
