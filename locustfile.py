from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 2)

    @task
    def load_homepage(self):
        self.client.get("/")

    @task
    def load_about(self):
        self.client.get("/about")