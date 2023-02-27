import React, {useState} from 'react'
import {Button, Card, Checkbox, Input, Row, Col } from 'antd';
import Form from '../components/Form';
import appStore from "../store/AppStore";
import FeedbackStore from "../store/FeedbackStore";
import {PhoneInput} from "../components/Input";
import {useTranslation} from "react-i18next";

const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
};
const tailLayout = {
  wrapperCol: {offset: 6, span: 18},
};

const checkForm = object => {
  for (const key in object) {
    if (key === 'middleName') {
      continue;
    }
    if (!object[key]) {
      return false;
    }
  }
  return true;
};

const Feedback = () => {
  const {t} = useTranslation()
  const [state, setState] = useState({
    lastName: '',
    name: '',
    mail: '',
    middleName: '',
    phoneNumber: '',
    message: '',
    agreement: false
  });

  const onFinish = async () => {
    if (checkForm(state)) {
      try {
        await FeedbackStore.postFeedback({...state, date: new Date()});
        appStore.setAlert('success', 'Ваше обращение успешно отправлено администрации сайта.');
        setState({
          lastName: '',
          name: '',
          mail: '',
          middleName: '',
          phoneNumber: '',
          message: '',
          agreement: false
        });
      } catch (e) {
        appStore.setAlert('error', 'Ошибка при отправке вашего обращения. Попробуйте еще раз.')
        console.log(e);
      }
    }
  };


  return (
    <div>
      <h2 className="titleCont">{t('Обратная связь')}</h2>
      <Card style={{padding: "20px 0"}}>
        <Row justify="space-around" gutter={50}>
          <Col span={20} order={2} lg={{span: 14, order: 1}}>

            <Form {...layout}>
              <Form.Item
                name="lastName"
                label={t('Фамилия')}
                rules={[{required: true, message: `${t('Введите фамилию')}!`}]}
              >
                <Input
                  placeholder={t('Введите фамилию')}
                  value={state.lastName}
                  onChange={e => setState({...state, lastName: e.target.value})}
                />
              </Form.Item>

              <Form.Item
                name="name"
                label={t('Имя')}
              >
                <Input
                  placeholder={t('Введите имя')}
                  value={state.name}
                  onChange={e => setState({...state, name: e.target.value})}
                />
              </Form.Item>

              <Form.Item
                name="middleName"
                label={t('Отчество')}
              >
                <Input
                  placeholder={t('Введите Отчество')}
                  value={state.middleName}
                  onChange={e => setState({...state, middleName: e.target.value})}
                />
              </Form.Item>


              <Form.Item
                name="mail"
                label={t('Электронная почта')}
                rules={[{required: true, message: `${t('Введите почту')}!`}]}
              >
                <Input
                  placeholder={t('Введите почту')}
                  value={state.mail}
                  onChange={e => setState({...state, mail: e.target.value})}
                />
              </Form.Item>

              <Form.Item
                name="phoneNumber"
                label={t('Номер телефона')}
                rules={[{required: true, message: `${t('Введите номер')}!`}]}
              >
                <PhoneInput
                  placeholder={t('Введите номер')}
                  value={state.phoneNumber}
                  onChange={v => setState({...state, phoneNumber: v})}
                />
              </Form.Item>


              <Form.Item
                name="message"
                label={t('Ваше сообщение')}
                rules={[{required: true, message: `${t('Введите сообщение')}`}]}
              >
                <Input.TextArea
                  placeholder= {t('Введите сообщение')}
                  value={state.message}
                  onChange={e => setState({...state, message: e.target.value})}
                />
              </Form.Item>

              <Form.Item
                name="agreement"
                rules={[
                  {
                    validator: (_, value) =>
                      state.agreement ? Promise.resolve() : Promise.reject(new Error(t('Примите соглашения для отправки обращения'))),
                  },
                ]}
                {...tailLayout}
              >
                <Checkbox
                  checked={state.agreement}
                  onChange={() => setState({...state, agreement: !state.agreement})}
                >
                  {t('Я соглашаюсь на обработку своих личных данных')}
                </Checkbox>
              </Form.Item>

              <Form.Item
              >
                <Button
                  onClick={onFinish}
                  disabled={!checkForm(state)}
                >
                  {t('Отправить')}
                </Button>
              </Form.Item>

            </Form>
          </Col>

          <Col lg={{span: 10, order: 2}} span={20} order={1} >
            <div className="text-contact">
              <p>
                {t('Заполните форму для отправки вашего сообщения администрации сайта.')}
              </p>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );

}

export default Feedback;
