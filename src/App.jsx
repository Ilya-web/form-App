import React, {useState, useEffect} from 'react';
import {Row, Col, Form, Input, Button, Radio, Select, DatePicker} from 'antd';
import moment from 'moment';

import Api from "./API/PostServis";
import Modal from "antd/es/modal/Modal";
import {rules} from "./constants";
import {Steps} from "./components/Steps";

import './style.css'
import 'antd/dist/antd.css';


const App = () => {

  const [users, setUsers] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [allAlbums, setAllAlbums] = useState([]);
  const [userSearch, setUserSearch] = useState({});

  const [optionList, setOptionList] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [disableBool, disableSelect] = useState(true);
  const [typeRadio, setTypeRadio] = useState();
  const [optionListDesc, setOptionListDesc] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [finishForm, setFinishForm] = useState({});


  const [isSearchBtnDisabled, setIsSearchBtnDisabled] = useState(true);
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(true);
  const [form] = Form.useForm();


  useEffect(() => {
    fetchApiUsers();
  },[]);


  useEffect(() => {
    if (userSearch?.id) {
      activeUser(userSearch.userId);
      setCurrentStep(2);
      disableSelect(false);
      form.setFieldsValue({
        listId: userSearch.userId,
        listOptions: userSearch.id
      });
    }
  },[userSearch]);

  useEffect(() => {
    if (userSearch?.id) {
      descActiveUserPost(userSearch.id)
    }
  }, [optionList, userSearch]);

  async function fetchApiUsers () {
    const users = await Api.getUsers()
    setUsers(users);
  }

  async function fetchApi (url) {
    const types = await Api.getAll(url)
    if(url === 'posts') {
      setAllPosts(types)
    }
    if(url === 'albums') {
      setAllAlbums(types)
    }
  }

  async function getObjTypes (typeRadioActive, valueId) {
    const objTypes = await Api.getObjTypes(typeRadioActive, valueId)
    setUserSearch(objTypes)
  }

  function disabledDate(current) {
    return current && current < moment().endOf('day');
  }

  const onFinish = (values) => {
    setFinishForm(values)
    showModal()
  };

  // фун-я контролирущая изменения в форме
  const onChange = (changedValues) => {
    const fieldName = Object.entries(changedValues)[0][0];
    const fieldValue = Object.entries(changedValues)[0][1];

    if(fieldName === 'type') {
      setTypeRadio(fieldValue)
      form.setFieldsValue({
        listId: undefined,
        listOptions: undefined,
        searchInput: undefined,
        deliveryDate: undefined,
        carrier: undefined,
      });
      disableSelect(true)
      setOptionListDesc([])
    }
    if(fieldValue === 'posts' || fieldValue === 'albums') {
      fetchApi(fieldValue);
      setCurrentStep(1)
    }
    if(fieldName === 'listId') {
      form.setFieldsValue({
        listOptions: undefined,
        searchInput: undefined
      });
      setIsSearchBtnDisabled(true);
      setOptionListDesc([]);
      setCurrentStep(1);
      activeUser(fieldValue);
      disableSelect(!fieldValue);
    }
    if(fieldName === 'listOptions') {
      fieldValue ? setCurrentStep(2) : setCurrentStep(1);
      form.setFieldsValue({
        searchInput: undefined
      });
      setIsSearchBtnDisabled(true);
      descActiveUserPost(fieldValue)
    }
    if(fieldName === 'deliveryDate') {
      fieldValue ? setCurrentStep(3) : setCurrentStep(2);
    }
    if(fieldName === 'carrier') {
      setCurrentStep(fieldValue ? 4 : 2)
    }
    if(fieldName === 'searchInput') {
      form.setFieldsValue({
        listId: undefined,
        listOptions: undefined,
      });
      setOptionListDesc([])
      if(fieldValue) setCurrentStep(1)
      disableSelect(true)
      setTimeout(function () {
        const errorSearch  = form.getFieldError('searchInput');
        const statusSearchBtn = !!errorSearch.length || (!errorSearch.length  && !fieldValue);
        setIsSearchBtnDisabled(statusSearchBtn);
      }, 10)
    }
    setTimeout(function () {
      const validForm = form.getFieldsError()
      const isDisabled = validForm.some(item => {
        if(item.name[0] === 'searchInput') return false;
        return item.errors.length || !form.isFieldTouched(item.name[0]);
      })
      setIsDisabledSubmit(isDisabled)
    }, 10)
  };

  const searchUser = () => {
    const valueId = form.getFieldValue('searchInput')
    const typeRadioActive = form.getFieldValue('type')
    getObjTypes(typeRadioActive, valueId)
  }

  const descActiveUserPost = (idType) => {
    const user = optionList.filter((item) => item.id === idType);
    setOptionListDesc(user);
  }

  const activeUser = (activeIdUser) => {
    if(activeIdUser) {
      let arrUserId = [];
      if(typeRadio === 'posts') {
        arrUserId = allPosts.filter(item => item?.userId === activeIdUser)
      }
      if(typeRadio === 'albums') {
        arrUserId = allAlbums.filter(item => item?.userId === activeIdUser)
      }
      setOptionList(arrUserId)
    }
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  return (
    <div className="container">
      <Row gutter={24}>
        <Col span={24}>
          <Steps currentStep={currentStep} />
        </Col>
        <Col span={24}>
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            onValuesChange={onChange}
          >
            <Form.Item
              name='type'
              label='Type'
            >
              <Radio.Group
                cheked={false}
              >
                <Radio value="posts">posts</Radio>
                <Radio value="albums">albums</Radio>
              </Radio.Group>
            </Form.Item>
            <Row align="bottom" gutter={24}>
              <Col sm={8} xs={24}>
                <Form.Item
                  label={`Enter ${typeRadio ? typeRadio : ''} number id`}
                  name='searchInput'
                  rules={rules.searchInput}
                >
                  <Input
                    disabled={!currentStep >= 1}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button
                    htmlType='button'
                    type='primary'
                    onClick={searchUser}
                    disabled={isSearchBtnDisabled}
                  >
                    Primary
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col sm={12} xs={24}>
                <Form.Item
                  label= 'Choose user'
                  name="listId"
                  rules={[{
                    required: true,
                    message: "is required"
                  }]}
                >
                  <Select
                    allowClear
                    disabled={!currentStep >= 1}
                  >
                    {users.map(item =>{
                        return  <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={12} xs={24}>
                <Form.Item
                  label={`Select ${typeRadio ? typeRadio : 'options'}`}
                  name="listOptions"
                  rules={rules.select}
                >
                  <Select
                    allowClear
                    disabled={disableBool}
                  >
                    {optionList.map(item =>{
                      return  <Select.Option value={item.id} key={item.id}>{item.title}</Select.Option>
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row  gutter={24} justify="end">
              <Col span={12}>
                {
                  optionListDesc ?
                    optionListDesc.map(item => {
                      return item.body
                    })
                    :
                    null
                  }
              </Col>
            </Row>
            <Form.Item
              label="Delivery date"
              name="deliveryDate"
              rules={rules.deliveryDate}
            >
              <DatePicker
                name="date-picker"
                disabledDate={disabledDate}
                disabled={currentStep < 2}
              />
            </Form.Item>

            <Form.Item
              label="Сhoose a carrier"
              name="carrier"
              rules={rules.select}
            >
              <Select
                allowClear
                disabled={currentStep < 2}
              >
                <Select.Option value="delivery 1">delivery 1</Select.Option>
                <Select.Option value="delivery 2">delivery 2</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item >
              <Button
                type="primary"
                htmlType="submit"
                disabled={isDisabledSubmit}
              >
                Send
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col>
          <Modal
            title="Info order"
            visible={isModalVisible}
            onOk={()=> setIsModalVisible(false)}
            footer={null}
            onCancel={()=> setIsModalVisible(false)}
          >
            {finishForm && (
              <>
                <p>Type: <b>{finishForm.type}</b></p>
                <p>Choose user id: <b>{finishForm.listId}</b></p>
                <p>Select {typeRadio} id: <b>{finishForm.listOptions}</b></p>
                { optionListDesc[0]?.body && (
                  <p>Select {typeRadio} description : <b> {optionListDesc[0].body}</b></p>
                  )
                }
                <p>Delivery date: <b>{finishForm.deliveryDate?.format("dddd, MMMM Do YYYY")}</b></p>
                <p>Choose a carrier: <b>{finishForm.carrier}</b></p>
                <Button
                  type="primary"
                  onClick={()=> setIsModalVisible(false)}
                >
                  Ok
                </Button>
              </>
            )}
          </Modal>
        </Col>
      </Row>
    </div>
  );
};

export default App;


