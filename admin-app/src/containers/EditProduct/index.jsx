import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import { useFieldArray, useForm } from 'react-hook-form';
import ImageUploading from 'react-images-uploading';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { deleteProduct, getProductById, updateProduct } from '../../actions/product.actions';
import { generatePictureUrl } from '../../urlConfig';
import './style.css';
function EditProduct(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [category, setCategory] = useState();
  const [images, setImages] = useState([]);
  const [isReplace, setReplace] = useState(false);
  const maxNumber = 5;
  const { categories } = useSelector((state) => state.categories);
  const { product } = useSelector((state) => state.products);
  const { register, control, handleSubmit, setValue, getValues, reset } = useForm();

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }
  }, [dispatch, id]);
  useEffect(() => {
    if (categories && Object.keys(categories).length > 0 && product && Object.keys(product).length > 0) {
      const cate = categories.find((cate) => cate.name === product.category);
      setCategory(cate);
      reset({ ...product });
    }
  }, [reset, categories, product]);

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    setImages(imageList);
  };
  // categoryInfo,

  const { fields: categoryInfo } = useFieldArray({
    control,
    name: 'categoryInfo',
  });

  const onSubmit = (data) => {
    const form = new FormData();
    Object.keys(data).forEach((key, index) => {
      if (!['category', 'categoryInfo', 'productPictures'].includes(key)) {
        form.append(key, data[key]);
      }
    });
    form.append('category', category.name);
    for (let field of data.categoryInfo) {
      form.append('categoryInfo', JSON.stringify({ name: field.name, value: field.value }));
    }
    if (isReplace) {
      for (let pic of images) {
        form.append('productPictures', pic.file);
      }
    } else if (product.productPictures.length > 0) {
      form.append('productPictures', product.productPictures);
    }
    dispatch(updateProduct(id, form));
  };

  const onDelete = () => {
    dispatch(deleteProduct(id));
    history.push('/products');
  };

  return (
    <Container>
      <div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Label className='form__title d-block'>Product name:</Form.Label>
          <Form.Control className='form__input w-100' {...register(`name`)} placeholder='Category name' />
          <Row>
            <Col lg={4}>
              <Form.Label className='form__title d-block'>Regular Price:</Form.Label>
              <Form.Control
                className='form__input w-100'
                {...register(`regularPrice`)}
                placeholder='0'
                onChange={(e) => {
                  const salePrice = getValues('salePrice');
                  const result = Math.round((1 - Number(salePrice) / Number(e.target.value)) * 100);
                  setValue('sale', result.toString());
                }}
              />
            </Col>
            <Col lg={4}>
              <Form.Label className='form__title d-block'>Sale Price:</Form.Label>
              <Form.Control
                className='form__input w-100'
                {...register(`salePrice`)}
                placeholder='0'
                onChange={(e) => {
                  const regularPrice = getValues('regularPrice');
                  const result = Math.round((1 - Number(e.target.value) / Number(regularPrice)) * 100);
                  setValue('sale', result.toString());
                }}
              />
            </Col>
            <Col lg={4}>
              <Form.Label className='form__title d-block'>Sale:</Form.Label>
              <InputGroup className='w-100'>
                <FormControl className='form__input w-75' readOnly {...register(`sale`)} placeholder='0' />
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
          <Form.Label className='form__title d-block'>Quantity:</Form.Label>
          <Form.Control className='form__input w-100' {...register(`quantity`)} placeholder='0' />
          <Form.Label className='form__title d-block'>Description:</Form.Label>
          <Form.Control
            as='textarea'
            className='form__input w-100'
            {...register(`description`)}
            placeholder='Description'
          />
          <Form.Label className='form__title d-block'>Category:</Form.Label>
          {categories.length > 0 && (
            <Form.Control
              as='select'
              value={(category && category.name) || -1}
              onChange={(e) => {
                const cate = categories.find((cate) => cate.name === e.target.value);
                setCategory(cate);
              }}
            >
              <option disabled value={-1} key={-1}>
                Open this select menu
              </option>
              {categories.map((cate) => (
                <option value={cate.name} key={cate._id}>
                  {cate.name}
                </option>
              ))}
            </Form.Control>
          )}
          {category &&
            category.filterField.map((field, index) => (
              <div>
                <Form.Label className='form__title d-block'>{field.name}</Form.Label>
                <Form.Control
                  as='textarea'
                  hidden
                  value={field.name}
                  {...register(`categoryInfo.${index}.name`)}
                  placeholder='Description'
                />
                <Form.Control as='select' {...register(`categoryInfo.${index}.value`)}>
                  {field.value.map((value) => (
                    <option value={value} key={value}>
                      {value}
                    </option>
                  ))}
                </Form.Control>
              </div>
            ))}
          <>
            <Form.Label className='form__title'>Product's pictures:</Form.Label>
            <Button
              variant='outline-primary'
              onClick={() => {
                setReplace((prev) => !prev);
              }}
            >
              Toggle replace
            </Button>
            <div className='product__images'>
              <div className='product__images-container'>
                {Object.keys(product).length > 0 &&
                  product.productPictures &&
                  product.productPictures.map((image, index) => (
                    <div key={index}>
                      <div className='product__images-image-wrapper'>
                        <img
                          src={generatePictureUrl(image)}
                          alt=''
                          width='100'
                          className='product__images-image--view'
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>

          {isReplace && (
            <ImageUploading multiple value={images} onChange={onChange} maxNumber={maxNumber} dataURLKey='data_url'>
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
              }) => (
                // write your building UI
                <>
                  <Form.Label className='form__title d-block'>Replace by below pictures:</Form.Label>
                  <div className='product__images'>
                    <Button
                      variant='outline-primary'
                      className='product__images--add'
                      style={isDragging ? { color: 'red' } : null}
                      onClick={onImageUpload}
                      {...dragProps}
                    >
                      Click or Drop here
                    </Button>
                    <Button variant='outline-danger' className='product__images--remove-all' onClick={onImageRemoveAll}>
                      Remove all images
                    </Button>
                    <div className='product__images-container'>
                      {imageList.map((image, index) => (
                        <div key={index}>
                          <div className='product__images-image-wrapper'>
                            <img
                              src={image.data_url}
                              alt=''
                              width='100'
                              className='product__images-image'
                              onClick={() => onImageRemove(index)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </ImageUploading>
          )}
          <div className='mt-2'>
            <Button type='submit' variant='success' className='mr-2'>
              Submit
            </Button>
            <Button variant='danger' onClick={onDelete}>
              Delete product
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default EditProduct;
