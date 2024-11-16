import { PromptTemplate } from "@langchain/core/prompts"

const promptTemplate = new PromptTemplate({
  inputVariables: ["twitter_profile"],
  template: `
    You will receive:

- The **Twitter profile description** of a user.
- **Profile data of any Twitter handles** mentioned by the user.
- The **content of any website URLs** mentioned by the user.
- **Responses to a survey** about the user's interests.

Your task is to analyze this data to extract and fill out the following **Demographic**, **Interest**, and **Behavior** categories and subcategories. For each extracted value, provide a **confidence score** (0.1 to 1) and include the **argument** that supports the extracted value. Do not output any field that is Null or empty because there is no evidence or data to show.

# Demographic Categories:

- **Age Range**: 18-24, 25-34, 35-44, 45-54, 55-64, 65-74, 75+ (**choose only from this list**)
- **Gender**: male, female, non-binary (**choose only from this list**)
- **Languages**: For each language mentioned, provide a separate confidence score and argument.
- **Location**: Include country and city if mentioned or implied.
- **Work**:
 - **Job Title**: Extract the job title(s) from the data, each with its own confidence score and argument.
 - **Employers**: List any employers mentioned, each with its own confidence score and argument.
 - **Industries**: Extract the industries the user works in, each with its own confidence score and argument.
- **Relationships**: single, in a relationship, married, engaged, unspecified, open relationship, complicated, separated, divorced, widowed (**choose only from this list**)
- **Generation**: baby boomer, generation x, millennial, generation z, generation alpha (**choose only from this list**)
- **Politics**: active, liberal, moderate, conservative, very conservative, very liberal (**choose only from this list**)
- **Ethnic Affinity**: African, Asian, European, Middle Eastern, North African, Latino/Hispanic, Indigenous Peoples, Pacific Islander, Afro-Caribbean, Jewish (**choose only from this list**)
- **Education**:
 - **Education Level**: college grad, doctorate degree, high school grad, in college, in grad school, in high school, master’s degree, professional degree, unspecified (**choose only from this list**)
 - **Fields of Study**: For each field of study mentioned, provide a separate confidence score and argument.
 - **Schools**: For each school mentioned, provide a separate confidence score and argument.
- **Parents**:
 - **Children**: If the user mentions children, include details about their **gender** and **age range**, each with a confidence score and argument.

# Interest Categories:

- **Technology**:
 - **Computers**: desktop, laptop, tablet, etc.
 - **Consumer Electronics**: game console, e-book reader, cameras, smartphones, televisions, etc.
 - **Crypto**:
  - **Blockchains**: Ethereum, Bitcoin, Solana, etc.
  - **NFTs**: collectibles, art, gaming, memories, etc.
  - **Socials**: Farcaster, Bluesky, Lens, Drakula, Wildcard, Zora, etc.
  - **Play-to-Earn**: Axie Infinity, Sandbox, etc.
  - **DAOs**: Nouns, Mantle, etc.
  - **DeFi**: yield farming, staking, lending, etc.

- **Entertainment**:
 - **Live Events**: ballet, bars, concerts, dance halls, music festivals, nightclubs, parties, plays, theatre, etc.
 - **Games**: action, board, browser, card, casino, first-person shooter, gambling, MMO, MMORPG, online, puzzle video, racing, role-playing, shooter, simulation, strategy, video, word.
 - **Movies**: action, animated, anime, Bollywood, comedy, documentary, drama, fantasy, horror, musical theatre, science fiction, thriller.
 - **Reading**: books, comics, e-books, fiction, literature, magazines, manga, mystery fiction, newspapers, non-fiction, romance.
 - **TV**: comedy, game shows, reality, talk shows.
 - **Music**: blues, classical, country, dance, electronic, gospel, heavy metal, hip hop, jazz, music videos, pop, rhythm & blues, rock, soul.

- **Sports & Outdoors**:
 - **Sports**: American football, soccer, auto racing, baseball, basketball, college football, golf, marathons, snowboarding, swimming, tennis, volleyball, skiing, etc.
 - **Outdoor Recreation**: boating, camping, fishing, hiking, horseback riding, hunting, mountain biking, surfing, etc.

- **Food & Drink**:
 - **Alcoholic Drinks**: beer, distilled beverages, wine.
 - **Beverages**: coffee, energy drinks, juice, soft drinks, tea, mate, matcha, etc.
 - **Cooking**: baking, recipes.
 - **Cuisine**: Chinese, French, German, Greek, Indian, Italian, Japanese, Korean, Latin American, Mexican, Middle Eastern, Spanish, Thai, Vietnamese, Persian, etc.
 - **Food**: barbecue, chocolate, desserts, fast food, organic food, pizza, seafood, veganism, vegetarianism.
 - **Restaurants**: coffeehouses, diners, fast casual restaurants, fast food restaurants, etc.

- **Business & Industry**:
 - **Fields**: Advertising, Agriculture, Architecture, Aviation, Banking, Economics, Engineering, Entrepreneurship, Healthcare, Higher Education, Management, Marketing.
 - **Design**: fashion, graphic, interior.
 - **Online**: web development, web design, social media marketing, online advertising, email marketing, display advertising, digital marketing.
 - **Crypto**: smart contract development, auditing, full-stack development, token engineering, protocol design, incentive design, blockchain design, web3 UX, etc.
 - **Personal Finance**: credit cards, insurance, investment.
 - **Others**: Real Estate, Retail, Sales, Science, Small Business.

- **Hobbies & Activities**:
 - **Home & Garden**: DIY, furniture, gardening, home appliances, home improvement.
 - **Arts & Music**: acting, crafts, dance, drawing, drums, fine art, guitar, painting, performing arts, photography, sculpture, singing, writing, etc.
 - **Pets**: birds, cats, dogs, fish, horses, pet food, rabbits, reptiles, etc.
 - **Politics & Social Issues**: charity and causes, community issues, environmentalism, law, military, politics, religion, sustainability, veterans, volunteering, etc.
 - **Travel**: adventure, air travel, beaches, car rentals, cruises, ecotourism, hotels, lakes, mountains, nature, theme parks, tourism, vacations.
 - **Vehicles**: automobiles, boats, electric vehicles, hybrids, minivans, motorcycles, RVs, SUVs, scooters, trucks.

- **Shopping & Fashion**:
 - **Beauty**: beauty salons, cosmetics, hair products, spas, tattoos, etc.
 - **Clothing**: children's, men's, shoes, women's.
 - **Fashion Accessories**: dresses, handbags, jewelry, sunglasses.
 - **Toys**: toys and games.
 - **Shopping**: boutiques, coupons, discount stores, luxury goods, online shopping, shopping malls, second-hand, eco shopping.

- **Fitness & Wellness**: bodybuilding, dieting, gyms, meditation, nutrition, physical exercise, physical fitness, running, weight training, yoga, Zumba, Pilates, etc.

- **Family & Relationships**: dating, family, fatherhood, friendship, marriage, motherhood, parenting, weddings.

# Behavior Categories:

### Technology Usage

- **Console Gaming**
- **Technology Early Adopters**
- **Internet Browser Used**: Chrome, Firefox, Edge, Opera, Safari, Brave, etc.
- **Mobile Device Users**: Devices by brand (e.g., Apple, Samsung)
- **Event Creation**

### Professional Activities

- **Small Business Owners**
- **Works in the Crypto Industry**
- **Freelancer Paid in Crypto**
- **Open-Source Contributor to Crypto Projects**

### Financial Behavior

- **Exchange Usage**
 - **Centralized Exchange Users**: Binance, Coinbase, Kraken, etc.
 - **Decentralized Exchange Users**: Uniswap, CowSwap, Matcha, 1inch, etc.
- **Trading Behavior**
 - **High-Risk Investors**
 - **Conservative Investors**
 - **Day Traders**
 - **Technical Analysts**
 - **Futures & Derivatives Traders**
- **Investment Types**
 - **Multi-Asset Holders**
 - **Single-Asset Holders**
 - **Yield Farmers**
 - **Liquidity Providers**
 - **Crypto Borrowers**
 - **Crypto Lenders**
- **Payment Behavior**
 - **Uses Crypto for Regular Payments**
 - **Cross-Border Crypto Payments**

### Crypto Engagement

- **On-chain Behavior**
 - **Hypersub Subscriber**
 - **Art NFT Buyer**
 - **Moxie Fan Token Buyer**
 - **Daily Minter**
 - **Frequent Minter**
 - **Free Minter**
- **Airdrop Behavior**
 - **Airdrop Hunter**
 - **Airdrop Benefiter**
- **Tipping Behavior**
 - **Tip Farmer**
 - **Active Tipper**
 - **Moderate Tipper**
- **Crypto Project Affiliation**
 - **Token Holder**
 - **Protocol User**: Ethereum, Solana, etc.
 - **Cross-Chain Participant**
- **Community Engagement**
 - **DAO Member**
 - **Participates in Governance Voting**
 - **Attends Local Crypto Meetups**
 - **Attends Crypto Events**

### Content Consumption

- **Crypto Podcast Listeners**
- **Webinar Attendees** (crypto/blockchain focused)
- **YouTube Crypto Viewers**
- **Follows Crypto Influencers**
- **Crypto Newsletter Subscribers**

### Security & Privacy

- **Wallet User**
 - **Hot Wallet User**: MetaMask, Rainbow, Coinbase Wallet, etc.
 - **Cold Wallet User**: Ledger, Trezor, etc.
- **Multi-Signature Wallet User**
- **Uses VPN Regularly**
- **Privacy Coin User**: Monero, Zcash
- **Decentralized Web User**

### Lifestyle and Personal Values

- **Green Crypto User** (eco-friendly projects)
- **Involved in Crypto Philanthropy**
- **Decentralization Advocate**
- **Minimalist/Digital Nomad**

### Gaming and Metaverse

- **Play-to-Earn Participant**
- **Metaverse Real Estate Owner**

### Charitable and Social Behavior

- **Donates via Crypto Platforms**
- **Engaged in Blockchain Social Good Projects**

### Entrepreneurial Behavior

- **Crypto Startup Founder**
- **Crypto Venture Investor**

### Sports Engagement

- **Soccer Fan (High Engagement)**
- **Soccer Fan (Moderate Engagement)**
- **Baseball Enthusiast**
- **College Football Fan**
- **Cricket Fan**
- **Professional Football Fan**
- **Rugby Fan**
- **Olympics Enthusiast**
- **Paralympics Enthusiast**
- **World Cup Enthusiast**
- **Euro Cup Enthusiast**
- **Asian Cup Enthusiast**
- **Copa America Enthusiast**
- **Women's World Cup Enthusiast**

### Travel Behavior

- **Frequent Travelers**
- **Business Travelers**
- **Commuters**
- **Currently Traveling**
- **Frequent International Travelers**
- **Planning to Travel**
- **Returned from Trip**

### Expat Status

- **Expatriate**: User expatriating in a country
- **Family Abroad**: Family members living abroad
- **Friends Abroad**: Close friends living abroad

# Guidelines and Additional Instructions:

1. **Clarity and Precision**: Clearly communicate the information extracted, avoiding overcomplication while remaining thorough. For categories with lists, ensure each item is extracted separately with its own **value**, **confidence score**, and **argument**.

2. **Confidence Scores**: For each value in the categories, assign a **confidence score** between **0** and **1** based on the **strength of the arguments**, the **number of supporting data points**, and the **specificity of the information** provided.
  - A score of **1** indicates very high confidence (direct mention or multiple strong supporting data points).
  - A score of **0.5** indicates moderate confidence (hints, cultural references, or vague information).
  - For categories where a value can **always be inferred or guessed** (such as **gender**, **age range**, and **location**), make a **reasonable guess** and assign a **low confidence score** (e.g., **0.1** to **0.3**) rather than a confidence score of **0**.
  - If there is no relevant information for a subcategory, mark it as **null** with a confidence score of **0** unless guessing is instructed.

3. **Granular Approach**: For list-based categories, each item should have its own **value**, **confidence score**, and **argument**. For example, if multiple languages are mentioned, each language should be treated separately with its own confidence score and supporting argument.

4. **Iteration and Edge Cases**: Consider edge cases such as cultural references or events that might reveal demographic or interest information. Address these scenarios explicitly and include them in the output.

5. **Handling Contradictions**: If the information is contradictory, evaluate which information is stronger or more frequent and reflect this in the confidence score.

6. **Unclear Parts or Ambiguities**: If the provided data is unclear or ambiguous, note this in your output and reflect the uncertainty in the confidence score.

7. **Not specified or not found**: If there is no evidence or mentions for any of the attributes, meaning when confidence is zero, then do not show them in the output. Do not show Null or empty arrays or any attribute with confidence zero and remove it from the output.

8. **Formatting**: Ensure the output is a well-structured JSON object with the categories as keys. Subcategories should be nested where applicable. Do not use double quotes within double quotes; instead, use single quotes inside double quotes if needed.

**Input Data**:

- **Twitter Profile Description**: {twitter_profile}

   The output should be a well-structured JSON object with the **Demographic**, **Interest**, and **Behavior** categories as keys. For list-based categories, each value should have its own **value**, **confidence score**, and **argument**. Subcategories should be nested where applicable. Do not use double quotes within double quotes; instead, use single quotes inside double quotes if needed.

# Sample Output:

{{
  "demographic": {{
    "age_range": {{
      "value": "25-34",
      "confidence": 0.8,
      "argument": "The user's profile mentions 'Tech enthusiast in my late 20s' indicating an age range of 25-34."
    }},
    "gender": {{
      "value": "female",
      "confidence": 0.9,
      "argument": "The user uses feminine pronouns in her bio and survey responses."
    }},
    "languages": [
      {{
        "value": "English",
        "confidence": 1.0,
        "argument": "All provided data is in English."
      }},
      {{
        "value": "French",
        "confidence": 0.6,
        "argument": "The user mentioned 'Bonjour' in her profile, suggesting knowledge of French."
      }}
    ],
    "location": {{
      "country": {{
        "value": "Canada",
        "confidence": 0.85,
        "argument": "The user mentions living in Toronto, which is in Canada."
      }},
      "city": {{
        "value": "Toronto",
        "confidence": 0.9,
        "argument": "The user states 'Based in Toronto' in her profile."
      }}
    }},
    "work": {{
      "job_title": [
        {{
          "value": "Software Developer",
          "confidence": 0.95,
          "argument": "Profile states 'Software Developer at XYZ Corp.'"
        }}
      ],
      "employers": [
        {{
          "value": "XYZ Corp",
          "confidence": 0.9,
          "argument": "Direct mention of employer in profile."
        }}
      ],
      "industries": [
        {{
          "value": "Technology",
          "confidence": 0.9,
          "argument": "Working as a Software Developer indicates involvement in the Technology industry."
        }}
      ]
    }},
    "relationships": {{
      "value": "married",
      "confidence": 0.7,
      "argument": "Survey response indicates marital status as married."
    }},
    "generation": {{
      "value": "millennial",
      "confidence": 0.8,
      "argument": "Age range suggests millennial generation."
    }},
    "politics": {{
      "value": "liberal",
      "confidence": 0.6,
      "argument": "User follows liberal political handles."
    }},
    "ethnic_affinity": {{
      "value": "Asian",
      "confidence": 0.5,
      "argument": "Mentions celebrating Lunar New Year, suggesting Asian heritage."
    }},
    "education": {{
      "education_level": {{
        "value": "college grad",
        "confidence": 0.9,
        "argument": "States 'Alumni of University of Waterloo' indicating college graduation."
      }},
      "fields_of_study": [
        {{
          "value": "Computer Science",
          "confidence": 0.85,
          "argument": "Studied Computer Science as per profile."
        }}
      ],
      "schools": [
        {{
          "value": "University of Waterloo",
          "confidence": 0.9,
          "argument": "Direct mention in profile."
        }}
      ]
    }},
    "parents": {{
      "children": null,
      "confidence": 0,
      "argument": "No mention of children in any data provided."
    }}
  }},
  "interests": {{
    "technology": {{
      "computers": [
        {{
          "value": "laptop",
          "confidence": 0.8,
          "argument": "Mentions developing software on laptops."
        }}
      ],
      "crypto": {{
        "blockchains": [
          {{
            "value": "Ethereum",
            "confidence": 0.7,
            "argument": "User follows Ethereum-related handles."
          }}
        ],
        "NFTs": [
          {{
            "value": "art",
            "confidence": 0.6,
            "argument": "Mentions interest in digital art NFTs."
          }}
        ]
      }}
    }},
    "entertainment": {{
      "music": [
        {{
          "value": "electronic",
          "confidence": 0.7,
          "argument": "Mentions attending electronic music festivals."
        }}
      ],
      "movies": [
        {{
          "value": "science fiction",
          "confidence": 0.8,
          "argument": "Lists favorite movies as science fiction genre."
        }}
      ]
    }},
    "food & drink": {{
      "cuisine": [
        {{
          "value": "Japanese",
          "confidence": 0.9,
          "argument": "States love for Japanese cuisine in survey."
        }}
      ],
      "beverages": [
        {{
          "value": "tea",
          "confidence": 0.85,
          "argument": "Mentions drinking various teas daily."
        }}
      ]
    }},
    "fitness & wellness": [
      {{
        "value": "yoga",
        "confidence": 0.8,
        "argument": "Mentions practicing yoga regularly."
      }}
    ],
    "travel": [
      {{
        "value": "adventure",
        "confidence": 0.7,
        "argument": "Expresses interest in adventure travel destinations."
      }}
    ]
  }},
  "behavior": {{
    "technology_usage": {{
      "internet_browser_used": [
        {{
          "value": "Firefox",
          "confidence": 0.6,
          "argument": "Mentions preferring open-source software like Firefox."
        }}
      ],
      "mobile_device_users": [
        {{
          "value": "Apple",
          "confidence": 0.8,
          "argument": "Mentions using an iPhone."
        }}
      ]
    }},
    "financial_behavior": {{
      "investment_types": [
        {{
          "value": "crypto borrower",
          "confidence": 0.5,
          "argument": "Mentions exploring crypto lending platforms."
        }}
      ]
    }},
    "crypto_engagement": {{
      "community_engagement": [
        {{
          "value": "DAO member",
          "confidence": 0.6,
          "argument": "Expresses interest in joining DAOs."
        }}
      ]
    }},
    "security_and_privacy": {{
      "wallet_user": [
        {{
          "value": "hot wallet user",
          "confidence": 0.7,
          "argument": "Mentions using MetaMask for transactions."
        }}
      ],
      "uses_vpn_regularly": [
        {{
          "value": true,
          "confidence": 0.6,
          "argument": "Discusses importance of online privacy."
        }}
      ]
    }},
    "travel_behavior": {{
      "frequent_travelers": [
        {{
          "value": true,
          "confidence": 0.7,
          "argument": "Mentions traveling often for conferences."
        }}
      ]
    }}
  }}
}}
  `,
})

export default promptTemplate
