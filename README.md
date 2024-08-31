## 🚀 Process CSV

<a href="https://www.postman.com/test-api-personal/workspace/personal-testing/collection/28617093-4fe4b271-2606-4f98-aaba-abc3aa6342dd?action=share&creator=28617093" target="_blank" style="display: flex; align-items: center; text-decoration: none; color: inherit;">
    <img src="https://cdn.worldvectorlogo.com/logos/postman.svg" alt="Run in Postman" width="50" height="50">
    <span style="font-size: 1.5em; margin-right: 10px;">Run in Postman</span>
</a>



This guide walks you through using the Image Processing API, enabling you to upload a CSV file for validation and effortlessly queue your images for compression.


### System Design Flow

For a visual representation of the system design, including the flow of data and interactions between components, you can view the diagram [here](https://drive.google.com/file/d/1_LjoP7jlBBO_Nci8NCNiZtAwRsFgquhe/view?usp=sharing).


### 🔖 How to Use This Collection

**Step 1: Send Request to `/image/upload`**

- Use this endpoint to upload your CSV file for validation and queue it for image compression.

**Step 2: View Responses**

- After sending the request, check the response tab for the status code (`200 OK`), response time, and size. You'll also receive a unique `requestId`.

**Example Response with `requestId`:**

```json
{
    "requestId": "58ef8dfa-41cf-4744-87dd-a2d4e027113c"
}
```

**Step 3: Check the Status with `/status/:id`**

- You can repeatedly call the `/status/:id` endpoint using the `requestId` to get the current processing status of each product in the CSV.

### Status Tracking Responses

**25% Progress**

```json
{
    "requestId": "58ef8dfa-41cf-4744-87dd-a2d4e027113c",
    "status": "In Progress",
    "progress": 25,
    "uploadedUrls": {
        "SKU2": [
            "https://res.cloudinary.com/di0acux8s/image/upload/v1725108922/mhf2kuqa2xgmd8ybwlx6.jpg"
        ]
    }
}
```

**50% Progress**

```json
{
    "requestId": "58ef8dfa-41cf-4744-87dd-a2d4e027113c",
    "status": "In Progress",
    "progress": 50,
    "uploadedUrls": {
        "SKU2": [
            "https://res.cloudinary.com/di0acux8s/image/upload/v1725108922/mhf2kuqa2xgmd8ybwlx6.jpg"
        ],
        "SKU3": [
            "https://res.cloudinary.com/di0acux8s/image/upload/v1725108923/vgyloexrqswikf6bdtid.jpg"
        ]
    }
}
```

**100% Completion**

```json
{
    "requestId": "58ef8dfa-41cf-4744-87dd-a2d4e027113c",
    "status": "Completed Successfully",
    "progress": 100,
    "uploadedUrls": {
        "SKU2": [
            "https://res.cloudinary.com/di0acux8s/image/upload/v1725108922/mhf2kuqa2xgmd8ybwlx6.jpg"
        ],
        "SKU3": [
            "https://res.cloudinary.com/di0acux8s/image/upload/v1725108923/vgyloexrqswikf6bdtid.jpg"
        ],
        "SKU1": [
            "https://res.cloudinary.com/di0acux8s/image/upload/v1725108919/cqdabpe8bzcdyn8mm150.jpg",
            "https://res.cloudinary.com/di0acux8s/image/upload/v1725108921/ic1kkxbobbpk3mkvjhcn.jpg"
        ]
    }
}
```
