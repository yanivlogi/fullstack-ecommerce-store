import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fruitList } from "../js/fruitList";

const EditProduct = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [typeOptions, setTypeOptions] = useState([]);
  const [price, setPrice] = useState("");
  const [priceSale, setPriceSale] = useState("");
  const [priceCost, setPriceCost] = useState("");
  const [barcode, setBarcode] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("");
  const [storeLocation, setStoreLocation] = useState("");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [sellingType, setSellingType] = useState("in-store");
  const [description, setDescription] = useState("");
  const [removedImageIndices, setRemovedImageIndices] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [updateImages, setUpdateImages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [server_url] = useState(process.env.REACT_APP_SERVER_URL);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getProductById();
  }, []);

  const getProductById = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${server_url}/products/${id}`);
      setUserId(token);

      setName(data.name);
      setCategory(data.category);
      setType(data.type);
      setPrice(data.price);
      setPriceSale(data.priceSale);
      setPriceCost(data.priceCost);
      setBarcode(data.barcode);
      setSku(data.sku);
      setStock(data.stock);
      setStoreLocation(data.storeLocation);
      setWeight(data.weight);
      setLength(data.length);
      setWidth(data.width);
      setHeight(data.height);
      setSellingType(data.sellingType);
      setDescription(data.description);

      if (data.images?.length) {
        const formatted = data.images.map((img) => ({
          file: null,
          path: server_url + "/" + img.replaceAll("\\", "/"),
        }));
        setCurrentImages(formatted);
      }

      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    [
      ["name", name],
      ["category", category],
      ["type", type],
      ["price", price],
      ["priceSale", priceSale],
      ["priceCost", priceCost],
      ["barcode", barcode],
      ["sku", sku],
      ["stock", stock],
      ["storeLocation", storeLocation],
      ["weight", weight],
      ["length", length],
      ["width", width],
      ["height", height],
      ["sellingType", sellingType],
      ["description", description],
      ["userId", userId],
      ["removedImageIndices", JSON.stringify(removedImageIndices)],
    ].forEach(([key, val]) => formData.append(key, val));

    updateImages.forEach((image) => {
      formData.append("image[]", image.file);
    });

    try {
      await axios.put(`${server_url}/products/${id}`, formData);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (e) => {
    const selected = Array.from(e.target.files).map((file) => ({
      file,
      path: URL.createObjectURL(file),
    }));
    setUpdateImages((prev) => [...prev, ...selected]);
  };

  const removeCurrentImage = (index) => {
    setCurrentImages((prev) => prev.filter((_, i) => i !== index));
    setRemovedImageIndices((prev) => [...prev, index]);
  };

  const removeNewImage = (index) => {
    setUpdateImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (val) => {
    setCategory(val);
    setTypeOptions(["סוג 1", "סוג 2", "סוג 3"]); // שנה בהתאם למערכת שלך
  };

  return (
    <div className="container mt-5" style={{ direction: "rtl" }}>
      {isLoggedIn ? (
        <form onSubmit={updateProduct}>
          <h2 className="mb-4">✏️ עריכת מוצר</h2>

          <label>שם מוצר</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />

          <label className="mt-3">קטגוריה</label>
          <select className="form-select" value={category} onChange={(e) => handleCategoryChange(e.target.value)} required>
            <option value="">בחר קטגוריה</option>
            {fruitList.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <label className="mt-3">סוג</label>
          <select className="form-select" value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="">בחר סוג</option>
            {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          <label className="mt-3">ברקוד</label>
          <input type="text" className="form-control" value={barcode} onChange={(e) => setBarcode(e.target.value)} />

          <label className="mt-3">SKU</label>
          <input type="text" className="form-control" value={sku} onChange={(e) => setSku(e.target.value)} />

          <label className="mt-3">מיקום בחנות</label>
          <input type="text" className="form-control" value={storeLocation} onChange={(e) => setStoreLocation(e.target.value)} />

          <label className="mt-3">מלאי</label>
          <input type="number" className="form-control" value={stock} onChange={(e) => setStock(e.target.value)} />

          <label className="mt-3">מחיר רגיל (₪)</label>
          <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />

          <label className="mt-3">מחיר מבצע (₪)</label>
          <input type="number" className="form-control" value={priceSale} onChange={(e) => setPriceSale(e.target.value)} />

          <label className="mt-3">מחיר עלות (₪)</label>
          <input type="number" className="form-control" value={priceCost} onChange={(e) => setPriceCost(e.target.value)} />

          <label className="mt-3">משקל (ק"ג)</label>
          <input type="number" className="form-control" value={weight} onChange={(e) => setWeight(e.target.value)} />

          <div className="row mt-3">
            <div className="col-md-4">
              <label>אורך (ס"מ)</label>
              <input type="number" className="form-control" value={length} onChange={(e) => setLength(e.target.value)} />
            </div>
            <div className="col-md-4">
              <label>רוחב</label>
              <input type="number" className="form-control" value={width} onChange={(e) => setWidth(e.target.value)} />
            </div>
            <div className="col-md-4">
              <label>גובה</label>
              <input type="number" className="form-control" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
          </div>

          <label className="mt-3">אופן מכירה</label>
          {["in-store", "online", "both"].map((val) => (
            <div className="form-check" key={val}>
              <input
                className="form-check-input"
                type="radio"
                name="sellingType"
                value={val}
                checked={sellingType === val}
                onChange={(e) => setSellingType(e.target.value)}
              />
              <label className="form-check-label">
                {val === "in-store" ? "מכירה בחנות בלבד" :
                 val === "online" ? "מכירה אונליין בלבד" : "מכירה בשניהם"}
              </label>
            </div>
          ))}

          <label className="mt-3">תיאור</label>
          <textarea className="form-control" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />

          <label className="mt-3">תמונות קיימות</label>
          <div className="d-flex flex-wrap gap-2 mb-2">
            {currentImages.map((img, i) => (
              <div key={i} className="position-relative">
                <img src={img.path} alt="" width="120" className="img-thumbnail" />
                <button type="button" className="btn-close position-absolute top-0 start-0" onClick={() => removeCurrentImage(i)} />
              </div>
            ))}
          </div>

          <label>העלאת תמונות חדשות</label>
          <input type="file" multiple className="form-control mb-3" onChange={handleImageChange} />

          {updateImages.length > 0 && (
            <div className="d-flex flex-wrap gap-2">
              {updateImages.map((img, i) => (
                <div key={i} className="position-relative">
                  <img src={img.path} alt="" width="120" className="img-thumbnail" />
                  <button type="button" className="btn-close position-absolute top-0 start-0" onClick={() => removeNewImage(i)} />
                </div>
              ))}
            </div>
          )}

          <button className="btn btn-success mt-4" type="submit">שמור שינויים</button>
        </form>
      ) : (
        <div className="alert alert-danger">
          עליך להתחבר. <Link to="/userLogin" className="btn btn-primary ms-2">התחבר</Link>
        </div>
      )}
    </div>
  );
};

export default EditProduct;
