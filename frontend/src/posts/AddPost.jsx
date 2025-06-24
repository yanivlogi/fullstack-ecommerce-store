import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { vegetableCategories } from "../js/vegetableCategories.js";
import { leafyList } from "../js/leafyList.js";
import { rootList } from "../js/rootList.js";
import { fruitList } from "../js/fruitList.js";
import "../css/AddPost.css";
// בראש הקובץ
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


const AddPost = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [typeOptions, setTypeOptions] = useState([]);
  const [price, setPrice] = useState("");
  const [priceSale, setPriceSale] = useState("");
  const [priceCost, setPriceCost] = useState("");
  const [barcode, setBarcode] = useState("");
  const [sku, setSku] = useState("");
  const [storeLocation, setStoreLocation] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [server_url] = useState(process.env.REACT_APP_SERVER_URL);
  const [validationError, setValidationError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [sellingType, setSellingType] = useState("in-store");

const sensors = useSensors(useSensor(PointerSensor));

const SortableImage = ({ id, index, img, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
    position: "relative",
  };

  return (
    <div ref={setNodeRef} style={style} className="product-image-tile" {...attributes}>
      {/* אזור שניתן לגרירה בלבד */}
      <div {...listeners} style={{ width: "100%", height: "100%" }}>
        <img src={URL.createObjectURL(img)} alt={`image-${index}`} />
{index === 0 && <div className="main-image-badge">ראשית</div>}
      </div>

      {/* כפתור מחיקה שלא גורר */}
      <div className="tile-actions">
    <button type="button" className="remove-button" onClick={() => onRemove(index)}>
    🗑
  </button>

      </div>
    </div>
  );
};



  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleCategoryChange = (value) => {
    setCategory(value);
    switch (value) {
      case "ירקות עליים":
        setTypeOptions(leafyList);
        break;
      case "ירקות שורש":
        setTypeOptions(rootList);
        break;
      case "ירקות פירות":
        setTypeOptions(fruitList);
        break;
      default:
        setTypeOptions([]);
    }
  };

  const handleImageChange = (e) => {
    const selected = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selected]);
  };

const removeImage = (index) => {
  const tile = document.getElementById(`tile-${index}`);
  if (tile) {
    tile.classList.add('fade-out');
    setTimeout(() => {
      setImages((prev) => prev.filter((_, i) => i !== index));
    }, 300);
  }
};


  const submitProduct = async (e) => {
    e.preventDefault();
    if (priceSale && parseFloat(priceSale) > parseFloat(price)) {
      return setValidationError("מחיר מבצע לא יכול להיות גבוה מהמחיר הרגיל.");
    }

    setValidationError("");
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
      ["storeLocation", storeLocation],
      ["stock", stock],
      ["description", description],
      ["weight", weight],
      ["length", length],
      ["width", width],
      ["height", height],
      ["sellingType", sellingType],
      ["userId", localStorage.getItem("token")],
    ].forEach(([key, val]) => formData.append(key, val));

    images.forEach((img) => formData.append("image[]", img));

    try {
      await axios.post(`${server_url}/products`, formData);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger">
          עליך להתחבר כדי להוסיף מוצר.{" "}
          <Link to="/userLogin" className="btn btn-primary ms-2">התחבר</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container add-product-wrapper my-5" style={{ direction: "rtl" }}>
      <form onSubmit={submitProduct}>
        <h2 className="shop-title">הוספת מוצר חדש</h2>
        {validationError && <div className="alert alert-danger">{validationError}</div>}

        <div className="row g-4">
          <div className="col-md-8">
            <div className="form-card">
              <h4>📝 תיאור מוצר</h4>
              <label>שם מוצר</label>
              <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
              <label className="mt-3">תיאור</label>
              <textarea className="form-control" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <div className="form-card">
              <h4>📂 קטגוריה וסוג</h4>
              <div className="row">
                <div className="col-md-6">
                  <label>קטגוריה</label>
                  <select className="form-select" value={category} onChange={(e) => handleCategoryChange(e.target.value)} required>
                    <option value="">בחר קטגוריה</option>
                    {vegetableCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label>סוג</label>
                  <select className="form-select" value={type} onChange={(e) => setType(e.target.value)} required>
                    <option value="">בחר סוג</option>
                    {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-card">
              <h4>📌 מזהים ומלאי</h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <label>ברקוד</label>
                  <input type="text" className="form-control" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label>SKU (מזהה מוצר)</label>
                  <input type="text" className="form-control" value={sku} onChange={(e) => setSku(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label>מיקום בחנות</label>
                  <input type="text" className="form-control" value={storeLocation} onChange={(e) => setStoreLocation(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label>כמות במלאי</label>
                  <input type="number" className="form-control" value={stock} onChange={(e) => setStock(e.target.value)} required />
                </div>
              </div>
            </div>

            <div className="form-card">
              <h4>💰 מחירים</h4>
              <label>מחיר רגיל (₪)</label>
              <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
              <label className="mt-3">מחיר מבצע (₪)</label>
              <input type="number" className="form-control" value={priceSale} onChange={(e) => setPriceSale(e.target.value)} />
              <label className="mt-3">מחיר עלות (₪)</label>
              <input type="number" className="form-control" value={priceCost} onChange={(e) => setPriceCost(e.target.value)} />
            </div>
          </div>

          <div className="col-md-4">
<div className="form-card">
  <h4>🖼️ תמונות מוצר</h4>
  <p className="text-muted small">גרור תמונה ראשונה כדי להפוך אותה לתמונה הראשית.</p>

  <DndContext
    sensors={sensors}
    collisionDetection={closestCenter}
    onDragEnd={({ active, over }) => {
      if (active.id !== over?.id) {
        const oldIndex = images.findIndex((_, i) => `img-${i}` === active.id);
        const newIndex = images.findIndex((_, i) => `img-${i}` === over?.id);
        setImages(arrayMove(images, oldIndex, newIndex));
      }
    }}
  >
    <SortableContext
      items={images.map((_, i) => `img-${i}`)}
      strategy={verticalListSortingStrategy}
    >
      <div className="product-images-section">
        {/* ריבוע העלאה תמיד ראשון */}
        <label className="image-upload-tile">
          <input type="file" multiple hidden onChange={handleImageChange} />
          <div className="upload-box">
            <span className="upload-icon">📤</span>
            <span className="upload-text">Click to upload<br />or drag and drop</span>
          </div>
        </label>

        {/* כל שאר התמונות */}
        {images.map((img, i) => (
          <SortableImage
            key={`img-${i}`}
            id={`img-${i}`}
            index={i}
            img={img}
            onRemove={(index) =>
              setImages((prev) => prev.filter((_, idx) => idx !== index))
            }
          />
        ))}
      </div>
    </SortableContext>
  </DndContext>
</div>


            <div className="form-card">
              <h4>🚚 משלוח וגודל חבילה</h4>
              <label>משקל המוצר (ק״ג)</label>
              <input type="number" className="form-control" value={weight} onChange={(e) => setWeight(e.target.value)} />
              <label className="mt-3">מידות החבילה (ס״מ)</label>
              <div className="row g-2">
                <div className="col-md-4">
                  <label>אורך</label>
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
            </div>

            <div className="form-card">
              <h4>🛒 אופן המכירה</h4>
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
                      val === "online" ? "מכירה אונליין בלבד" :
                        "מכירה בחנות וגם אונליין"}
                  </label>
                </div>
              ))}
            </div>

            <div className="form-card form-card-buttons">
              <div className="button-group">
                <button type="button" className="btn-discard">בטל</button>
                <button type="button" className="btn-schedule">תזמן</button>
                <button type="submit" className="btn-primary-add">הוסף מוצר</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
