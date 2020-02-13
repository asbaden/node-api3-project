const express = require('express');
const Users = require("./userDb");
const Posts = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
	// do your magic!
	Users.insert(req.body)
		.then(data => {
			if (data) {
				res.status(200).json(data);
			} else {
				res.status(500).json({ message: "error" });
			}
		})
		.catch(err => {
			res.status(500).json({ message: "error" });
		});
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
	// do your magic!
	Posts.insert(req.body)
		.then(result => {
			if (result) {
				res.status(200).json(result);
			} else {
				res.status(500).json({ message: "error 1" });
			}
		})
		.catch(err => {
			res.status(500).json({ message: "error 2" });
		});
});



router.get("/", (req, res) => {
	// do your magic!
	Users.get()
		.then(data => {
			if (data) {
				res.status(200).json(data);
			} else {
				res.status(404).json({ message: "user not found" });
			}
		})
		.catch(err => {
			res.status(500).json({ message: "error" });
		});
});

router.get("/:id", validateUserId, (req, res) => {
	// do your magic!
	res.status(200).json(req.user);

});

router.delete("/:id", validateUserId, (req, res) => {
	// do your magic!
	Users.remove(req.params.id)
		.then(result => {
			if (result) {
				res.status(200).json(req.user);
			}
		})
		.catch(err => {
			res.status(500).json({ message: "error" });
		});
});




router.put("/:id", validateUserId, validateUser, (req, res) => {
	Users.update(req.params.id, req.body)
		.then(result => {
			if (result) {
				res.status(200).json(req.body);
			}
		})
		.catch(err => {
			res.status(500).json({ message: "error" });
		});
});

//custom middleware
function validateUserId(req, res, next) {
  //do your magic as well!
  const { id } = req.params;
  console.log("this is id in validate user", id)
  Users.getById(id)
  .then(user => {
    if(!user){
      res.status(400).json({ message: "invalid user id" })
    } else {
      req.user = user;
      console.log("this is the user", req.user)
      next();
    }
  })
  .catch(err => {
    res.status(500).json({errorMessage:"we failed you"})
  })

  
}


function validateUser(req, res, next) {
	// do your magic!
	if (!req.body) {
		res.status(400).json({ message: "missing user data" });
		return true;
	}
	if (!req.body.name) {
		res.status(400).json({ message: "missing required name field" });
		return true;
	}
	next();
}

function validatePost(req, res, next) {
  // do your magic!
  if (!req.body){
    res.status(400).json({ message: "missing post data "})
    return true;
  }
  if (!req.body.text) {
    res.status(400).json({ message: "missing reuired text field"})
    return true
  }
  next();

}

module.exports = router;
