<?php
/**
 * Description of EnUniversal
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @version 0.1
 * @since 26.06.2013
 */

class EnUniversal extends ExtBaseWindow
{
	/**
	 * Список полей ExtJs store
	 * @var CList
	 */
	public $storeProps;

	/**
	 * Список моделей данных, которые необходимо создать
	 * @var CList
	 */
	public $modelProps;

	/**
	 * Список store, которые необхоимо добавить к списку store окна в методе beforeGetExtJs
	 * Используется для добавления store combobox полей грида.
	 * @var array
	 */
	protected static $datasetProperties = array();

	public function initComponent()
	{
		parent::initComponent();
		if (is_null($this->storeProps))
			$this->storeProps = new CList;
		if (is_null($this->modelProps))
			$this->modelProps = new CList;
	}

	/**
	 * Метод добавления свойства store.
	 * @param string $property Название класса store
	 * @param array $store Конфигурационный объект store
	 * @return mixed
	 */
	public function addStore(ExtAbstractStore $store)
	{
		if (is_null($this->storeProps))
			$this->storeProps = new CList();
		$this->storeProps->add($store);
	}

	/**
	 * Метод добавлления модели данных
	 * @param EnWideModel $value
	 */
	public function addModel(ExtModel $value)
	{
		if (is_null($this->modelProps))
			$this->modelProps = new CList;
		$this->modelProps->add($value);
	}

	/**
	 * @param string $name
	 * @return EnStore
	 */
	public function getExtStoreByName($name)
	{
		$result = NULL;
		foreach ($this->storeProps as $store)
			if ($store->storeName === $name)
				$result = $store;
		return $result;
	}

	/**
	 * @inherit docs
	 */
	protected function beforeGetExtJs()
	{
		parent::beforeGetExtJs();
		foreach (self::$datasetProperties as $name => $ds)
		{
			$this->addStore($ds->getExtStore($name));
			$this->addModel($ds->getExtModel());
		}
	}

	/**
	 * Метод добавления store и модели в статическое хранилище для вывода их в конфигурации окна
	 * @param EnLocaleDataset $store
	 * @param string $name
	 */
	public static function addStaticDataset(EnLocaleDataset $dataset, $name = '')
	{
		if (empty($name))
			$name = EnUtil::getUid('StaticDataset');

		self::$datasetProperties[$name] = $dataset;
	}

}

