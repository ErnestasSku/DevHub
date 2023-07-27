#[derive(Debug, serde::Deserialize, serde::Serialize, Clone)]
pub enum ServerType {
    Task(TaskInfo),
}

#[derive(Debug, serde::Deserialize, serde::Serialize, Clone)]
pub struct SFField {
    pub name: String,
    pub content: String,
}

#[derive(Debug, serde::Deserialize, serde::Serialize, Clone)]
pub struct TaskInfo {
    pub url: String,
    pub fields: Vec<SFField>,
}
