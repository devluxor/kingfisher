import JSONPretty from 'react-json-pretty';
import JSONPrettyMon from 'react-json-pretty/dist/monikai';


const CustomWSConnectionDetails = ({activeMessage, activeMessageId, connectionEstablished, wsServerURL}) => {
  
  return (
    <div className='message-details' style={{visibility: connectionEstablished ? 'visible' : 'hidden'}}>
      <div className='message-data'>
        <MessageDetails activeMessage={activeMessage}/>
      </div>
      <div className='message-server-url'>
        <h1>{connectionEstablished && wsServerURL}</h1>
      </div>
    </div>
  )
}

const MessageDetails = ({activeMessage}) => {
  if (!activeMessage) return

  const test = {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "age": 28,
        "email": "john.doe@example.com",
        "isAdmin": false,
        "preferences": {
          "theme": "dark",
          "notifications": {
            "email": true,
            "sms": false
          },
          "languages": ["en", "fr"]
        },
        "friends": [
          {
            "id": 2,
            "name": "Jane Smith",
            "since": "2022-05-15"
          },
          {
            "id": 3,
            "name": "Michael Brown",
            "since": "2021-11-20"
          }
        ]
      },
      {
        "id": 4,
        "name": "Alice Johnson",
        "age": 34,
        "email": "alice.j@example.com",
        "isAdmin": true,
        "preferences": {
          "theme": "light",
          "notifications": {
            "email": false,
            "sms": true
          },
          "languages": ["en", "es", "de"]
        },
        "friends": [
          {
            "id": 5,
            "name": "David Wilson",
            "since": "2023-02-10"
          }
        ]
      }
    ],
    "settings": {
      "siteName": "Example Website",
      "version": "1.3.5",
      "maxUsers": 5000,
      "features": {
        "commentsEnabled": true,
        "liveChat": false,
        "analytics": {
          "enabled": true,
          "trackingId": "UA-123456789-1"
        }
      }
    },
    "products": [
      {
        "productId": "A123",
        "productName": "Wireless Headphoneddddddddddds",
        "price": 99.99,
        "inStock": true,
        "categories": ["electronics", "audio"],
        "ratings": {
          "average": 4.5,
          "reviews": 320
        }
      },
      {
        "productId": "B456",
        "productName": "Smartphone",
        "price": 699.99,
        "inStock": false,
        "categories": ["electronics", "mobile"],
        "ratings": {
          "average": 4.7,
          "reviews": 850
        }
      }
    ]
  }

  return (
      <>
        <div className="arrived-on">
          <p>{activeMessage?.arrived_on || activeMessage?.arrivedOn}</p>
        </div>
        <div className="data">
          <pre className="data">{JSON.stringify(test, null, 4)}</pre>
          {/* <JSONPretty id="json-pretty" theme={JSONPrettyMon} data={activeMessage.data}></JSONPretty> */}
        </div>
      </>
  )
}

export default CustomWSConnectionDetails