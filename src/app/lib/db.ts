export type ProfileExtraction = {
  profile: string
  extraction: Record<"behavior" & "interest" & "demographic", any>
}

type Data = {
  usernameToProfileExtraction: Record<string, ProfileExtraction>
}

class DB {
  static defaultData: Data = {
    usernameToProfileExtraction: {},
  }

  static async getInstance() {
    const { JSONFilePreset } = await import("lowdb/node")

    const db = await JSONFilePreset<Data>("db.json", DB.defaultData)

    return db
  }
}

export default DB
